// src/app/api/call-logs/route.ts
import { query } from '@/lib/database';
import { auth } from '@/server/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log("Iniciando obtención de logs de llamadas...");
    
    // Verificar autenticación
    const session = await auth();
    console.log("Sesión obtenida:", JSON.stringify(session, null, 2));
    
    if (!session?.user?.id) {
      console.log("Usuario no autenticado");
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    console.log("ID de usuario:", userId);

    // Obtener el consultor ID del usuario actual
    console.log("Consultando consultant ID para user_id:", userId);
    const consultantResult = await query(
      `SELECT id FROM consultant WHERE user_id = $1`,
      [userId]
    );
    console.log("Resultado consulta consultant:", consultantResult);

    if (consultantResult.length === 0) {
      console.log("Consultor no encontrado para user_id:", userId);
      return NextResponse.json(
        { error: "Consultor no encontrado para este usuario" },
        { status: 404 }
      );
    }

    const consultantId = consultantResult[0]?.id ?? null;
    console.log("ID de consultor obtenido:", consultantId);

    // Verificar si el usuario es administrador
    console.log("Verificando si es administrador...");
    const isAdmin = await query(
      `SELECT 1 FROM administration WHERE administrator_id = $1`,
      [consultantId]
    );
    console.log("Resultado admin:", isAdmin);

    // Verificar si el usuario es supervisor
    console.log("Verificando si es supervisor...");
    const isSupervisor = await query(
      `SELECT 1 FROM supervision WHERE supervisor_id = $1`,
      [consultantId]
    );
    console.log("Resultado supervisor:", isSupervisor);

    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const filterConsultantId = searchParams.get('consultant_id');
    console.log("Filtro consultant_id:", filterConsultantId);
    
    // Construir la consulta SQL basada en el rol
    let sqlQuery = `
      SELECT 
        c.id,
        c.date as "callDate", 
        c.name as "tittle",
        cl.firstname as "clientFirstName",
        cl.lastname as "clientLastName",
        cl.firstname || ' ' || cl.lastname as client,
        co.name as "clientCompany",
        c.consultant_id,
        c.duration as time,
        c.type as category,
        CASE 
          WHEN c.satisfaction >= 7 THEN 'Positive'
          ELSE 'Negative'
        END AS rating,
        c.context,
        c.summary,
        c.feedback
      FROM calls c
      LEFT JOIN client cl ON c.client_id = cl.id
      LEFT JOIN company co ON cl.company_id = co.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    // Aplicar filtros según el rol
    if (isAdmin.length > 0) {
      // Los administradores pueden ver todo
      console.log("Usuario es administrador, mostrando todas las llamadas");
    } else if (isSupervisor.length > 0) {
      // Supervisores ven sus propias llamadas y las de sus supervisados
      console.log("Usuario es supervisor");
      
      // Obtener los consultores supervisados
      const supervisedIds = await query(
        `SELECT supervised_id FROM supervision WHERE supervisor_id = $1`,
        [consultantId]
      );
      console.log("Consultores supervisados:", supervisedIds);
      
      if (supervisedIds.length > 0) {
        // Extraer los IDs de supervisados
        const supervisedConsultantIds = supervisedIds.map(item => item.supervised_id);
        console.log("IDs de consultores supervisados:", supervisedConsultantIds);
        
        if (filterConsultantId) {
          // Si se proporciona un consultant_id específico, verificar que sea el propio o uno supervisado
          const filterId = parseInt(filterConsultantId);
          if (filterId === consultantId || supervisedConsultantIds.includes(filterId)) {
            sqlQuery += ` AND c.consultant_id = $${paramIndex++}`;
            queryParams.push(filterId);
          } else {
            // No tiene acceso a ese consultor
            return NextResponse.json({ error: "No autorizado para ver este consultor" }, { status: 403 });
          }
        } else {
          // Incluir llamadas propias y de supervisados
          sqlQuery += ` AND (c.consultant_id = $${paramIndex++} OR c.consultant_id = ANY($${paramIndex++}))`;
          queryParams.push(consultantId, supervisedConsultantIds);
        }
      } else {
        // Solo llamadas propias si no supervisa a nadie
        sqlQuery += ` AND c.consultant_id = $${paramIndex++}`;
        queryParams.push(consultantId);
      }
    } else {
      // Consultores solo ven sus propias llamadas
      console.log("Usuario es consultor, mostrando solo sus llamadas");
      sqlQuery += ` AND c.consultant_id = $${paramIndex++}`;
      queryParams.push(consultantId);
    }
    
    // Ordenar por fecha más reciente
    sqlQuery += ` ORDER BY c.date DESC`;
    
    console.log("SQL Query:", sqlQuery);
    console.log("Params:", queryParams);
    
    // Ejecutar la consulta con los parámetros adecuados
    const logs = await query(sqlQuery, queryParams);
    console.log(`Registros obtenidos: ${logs.length}`);
    
    // Transformar resultados para que coincidan con la estructura esperada por el frontend
    const transformedLogs = logs.map(log => ({
      ...log,
      callDate: log.callDate ? new Date(log.callDate).toISOString().split('T')[0] : null,
      clientCompany: log.clientCompany || 'No Company',
      time: log.time ? log.time.toString() : '0'
    }));
    
    return NextResponse.json(transformedLogs);
  } catch (error) {
    console.error("Error al obtener logs de llamadas:", error);
    return NextResponse.json(
      { error: "Error del servidor interno", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
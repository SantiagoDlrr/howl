import Button from "../button";

export default function CallLogPanel() {
  return (
    <div className="flex flex-col flex-[2.1]">
      <div className="border-black border-opacity-50 border-t border-b border-r-0 border-2 p-3">
        Historial de Llamadas
      </div>

      <div className="flex flex-col justify-between flex-1 p-6">
        <div>
          <Button label="+ Agregar Nueva Llamada" xl secondary />

          <div className="mt-6 mb-3 font-bold">Hoy</div>

          <div className="bg-purple-400 bg-opacity-30 rounded p-2">
            Neoris - venta - ene 16
          </div>

          <div className="p-2 mt-2">Cliente - Categoria - Fecha</div>
        </div>

        <Button label="Guardar llamadas en el Log" xl />
      </div>
    </div>
  );
}
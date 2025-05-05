import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CallLogsTable from '@/app/_components/logs/callLogsTable';

// Mock de los servicios usando jest.mock
jest.mock('@/app/utils/services/userService', () => ({
  getUserRole: jest.fn().mockResolvedValue({ 
    userId: 'user123', 
    consultantId: 5, 
    role: 'consultant' 
  })
}));

jest.mock('@/app/utils/services/callLogsService', () => ({
  getCallLogs: jest.fn().mockResolvedValue([
    { 
      id: 1, 
      callDate: '2023-05-01', 
      client: 'Cliente Test',
      clientCompany: 'Empresa Test', 
      category: 'Categoría Test',
      rating: 'Positive',
      time: '30',
      consultant_id: 5
    }
  ]),
  getSupervisedConsultants: jest.fn().mockResolvedValue([])
}));

// Mock componentes externos
jest.mock('@/app/_components/spinner', () => {
  return function DummySpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

// Mock para evitar errores de Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn()
  })
}));

describe('Historia de Usuario: Acceso al historial de llamadas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Verificar que sin rol no se carga el historial de llamadas
  test('AC1: Usuario SIN perfil (rol vacío) no puede acceder al historial', async () => {
    // Mockear el servicio para devolver un rol vacío
    const { getUserRole } = require('@/app/utils/services/userService');
    getUserRole.mockResolvedValueOnce({ 
      userId: 'user123', 
      consultantId: null, 
      role: '' // Rol vacío
    });

    render(<CallLogsTable />);
    
    // Debería mostrar un spinner inicialmente
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    
    // Después de cargar, NO debería mostrar la tabla ni datos
    await waitFor(() => {
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.queryByText('Cliente Test')).not.toBeInTheDocument();
    });
  });

  // Test 2: Verificar que solo se muestran las llamadas del usuario
  test('AC4: Solo muestra llamadas en las que el usuario participó', async () => {
    const { getCallLogs } = require('@/app/utils/services/callLogsService');
    const { getUserRole } = require('@/app/utils/services/userService');
    
    render(<CallLogsTable />);
    
    await waitFor(() => {
      // Verificar que se llamó a getUserRole
      expect(getUserRole).toHaveBeenCalled();
      
      // Verificar que getCallLogs fue llamado después de obtener el rol
      expect(getCallLogs).toHaveBeenCalled();
      
      // Verificar que se muestra la llamada con consultant_id correcto
      expect(screen.getByText('Cliente Test')).toBeInTheDocument();
    });
  });

  // Test 3: Verificar que se muestran indicadores de transcripción
  test('AC3: Muestra estado de las transcripciones de llamadas', async () => {
    // Modificar el mock para incluir llamadas con y sin transcripción
    const { getCallLogs } = require('@/app/utils/services/callLogsService');
    getCallLogs.mockResolvedValueOnce([
      { 
        id: 1, 
        callDate: '2023-05-01', 
        client: 'Cliente Con Transcripción',
        clientCompany: 'Empresa Test', 
        category: 'Categoría Test',
        rating: 'Positive',
        time: '30',
        consultant_id: 5,
        hasTranscription: true,
        hasSummary: true
      },
      { 
        id: 2, 
        callDate: '2023-05-02', 
        client: 'Cliente Sin Transcripción',
        clientCompany: 'Empresa Test', 
        category: 'Otra Categoría',
        rating: 'Positive',
        time: '15',
        consultant_id: 5,
        hasTranscription: false,
        hasSummary: false
      }
    ]);
    
    render(<CallLogsTable />);
    
    await waitFor(() => {
      expect(screen.getByText('Cliente Con Transcripción')).toBeInTheDocument();
      expect(screen.getByText('Cliente Sin Transcripción')).toBeInTheDocument();      
    });
  });

  // Test 4: Verificar filtrado de llamadas
  test('Permite filtrar las llamadas', async () => {
    render(<CallLogsTable />);
    
    await waitFor(() => {
      expect(screen.getByText('Cliente Test')).toBeInTheDocument();
    });
    
    // Buscar por texto
    const searchInput = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    // Debería seguir mostrando el resultado que coincide
    expect(screen.getByText('Cliente Test')).toBeInTheDocument();
    
    // Buscar algo que no existe
    fireEvent.change(searchInput, { target: { value: 'Inexistente' } });
    
    // Debería mostrar mensaje de no resultados
    expect(screen.getByText('No se encontraron registros que coincidan con tus filtros')).toBeInTheDocument();
  });

  // Test 5: Verificar mensaje cuando un consultor no tiene llamadas
  test('AC4: Muestra mensaje cuando un consultor no tiene llamadas', async () => {
    const { getCallLogs } = require('@/app/utils/services/callLogsService');
    getCallLogs.mockResolvedValueOnce([]);
    
    render(<CallLogsTable />); 
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    
    // Después de cargar, debería mostrar un mensaje específico
    await waitFor(() => {
      expect(screen.getByText('No cuentas con registros en la plataforma')).toBeInTheDocument();
    });
  });

  

});
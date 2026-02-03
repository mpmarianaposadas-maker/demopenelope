// Utility for exporting data to CSV format for administrative reports

export interface MetricaRow {
  fecha: string;
  expediente: string;
  tipoTramite: string;
  diasGestion: number;
  silencioEvitado: boolean;
  alertas: number;
  clasificacionCorrecta: boolean;
}

/**
 * Exports an array of data rows to a CSV file and triggers download
 * @param data - Array of MetricaRow objects to export
 * @param filename - Name of the file to download (without extension)
 */
export function exportToCSV(data: MetricaRow[], filename: string): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Define headers
  const headers = [
    'Fecha',
    'Expediente',
    'Tipo de Trámite',
    'Días de Gestión',
    'Silencio Evitado',
    'Alertas Generadas',
    'Clasificación Correcta'
  ];

  // Convert data to CSV rows
  const csvRows = data.map(row => [
    row.fecha,
    row.expediente,
    row.tipoTramite,
    row.diasGestion.toString(),
    row.silencioEvitado ? 'SÍ' : 'NO',
    row.alertas.toString(),
    row.clasificacionCorrecta ? 'SÍ' : 'NO'
  ]);

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Generates simulated demo data for metrics export
 * @param count - Number of rows to generate
 * @returns Array of MetricaRow objects
 */
export function generateDemoData(count: number = 50): MetricaRow[] {
  const tiposTramite = [
    'Licencia TIC - Alta',
    'Licencia TIC - Renovación',
    'Servicio Audiovisual - Alta',
    'Servicio Audiovisual - Modificación',
    'Registro RUPECO - Actualización'
  ];

  const data: MetricaRow[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const fecha = new Date(today);
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 90));
    
    const diasGestion = Math.floor(Math.random() * 20) + 1;
    const silencioEvitado = diasGestion <= 15 && Math.random() > 0.2;
    
    data.push({
      fecha: fecha.toLocaleDateString('es-AR'),
      expediente: `EX-2026-${(10000000 + Math.floor(Math.random() * 90000000)).toString()}-APN-ENACOM`,
      tipoTramite: tiposTramite[Math.floor(Math.random() * tiposTramite.length)],
      diasGestion,
      silencioEvitado,
      alertas: Math.floor(Math.random() * 3),
      clasificacionCorrecta: Math.random() > 0.06 // 94% accuracy
    });
  }

  // Sort by date descending
  return data.sort((a, b) => {
    const dateA = new Date(a.fecha.split('/').reverse().join('-'));
    const dateB = new Date(b.fecha.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });
}

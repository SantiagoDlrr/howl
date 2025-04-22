import { NextResponse } from 'next/server';
import { importDataFromSheets } from '@/scripts/formspostgre'; // Asegúrate que esta ruta es correcta

export async function POST() {
  try {
    await importDataFromSheets();
    return NextResponse.json({ message: '✅ Data imported successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('❌ Error running importDataFromSheets:', error.message || error);
    return NextResponse.json(
      { error: '❌ Import failed', details: error.message || String(error) },
      { status: 500 }
    );
  }
}
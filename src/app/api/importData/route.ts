import { NextResponse } from 'next/server';
import { importDataFromSheets } from '@/scripts/formspostgre'; // asegúrate que esta ruta es correcta

export async function POST() {
  try {
    await importDataFromSheets();
    return NextResponse.json({ message: '✅ Data imported successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error running importDataFromSheets:', error.message);
      return NextResponse.json(
        { error: '❌ Import failed', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('❌ Unknown error running importDataFromSheets:', error);
      return NextResponse.json(
        { error: '❌ Import failed', details: String(error) },
        { status: 500 }
      );
    }
  }
}
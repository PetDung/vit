import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save it directly to public/logo.png
    // The user wants to hardcode it so it loads without API calls
    const uploadDir = path.join(process.cwd(), 'public');
    const fileName = 'logo.png';
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    
    // Return the public URL
    return NextResponse.json({ success: true, url: `/${fileName}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}

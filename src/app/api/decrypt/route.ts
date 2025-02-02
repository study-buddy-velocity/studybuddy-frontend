import { createDecipheriv, createHash } from 'crypto';
import { NextResponse } from 'next/server';

const alg = 'aes-256-ctr';
const encryptkeyString = 'MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQBECoshPnFOL';
const key = createHash('sha256').update(String(encryptkeyString)).digest('base64').substring(0, 32);

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { encryptedPassword } = body;

    if (!encryptedPassword) {
      return NextResponse.json(
        { error: 'encryptedPassword is required' },
        { status: 400 }
      );
    }

    const [ivHex, encrypted] = encryptedPassword.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = createDecipheriv(alg, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return NextResponse.json({ decryptedPassword: decrypted });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: 'Failed to decrypt password' },
      { status: 500 }
    );
  }
}
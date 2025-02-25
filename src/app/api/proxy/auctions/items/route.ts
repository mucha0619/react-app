import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('X-API-KEY');
    if (!apiKey) {
      return NextResponse.json({ error: 'API 키가 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Proxy received request body:', body);
    
    const apiUrl = 'https://developer-lostark.game.onstove.com/auctions/items';
    console.log('Sending request to:', apiUrl);
    console.log('With headers:', {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `bearer ${apiKey}`
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    console.log('API response status:', response.status);
    const data = await response.text();
    console.log('API response data:', data);

    // API 응답의 Content-Type 헤더를 유지
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/json');

    return new NextResponse(data, {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

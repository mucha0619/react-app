import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://developer-lostark.game.onstove.com';
const CALENDAR_ENDPOINT = '/gamecontents/calendar';
const MARKET_ENDPOINT = '/markets/items';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('endpoint');

    if (!type) {
      return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
    }

    if (!process.env.LOST_ARK_API_KEY) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    const headers = {
      'accept': 'application/json',
      'authorization': `bearer ${process.env.LOST_ARK_API_KEY}`
    };

    let endpoint;
    switch (type) {
      case 'calendar':
        endpoint = `${API_BASE_URL}${CALENDAR_ENDPOINT}`;
        break;
      case 'market':
        endpoint = `${API_BASE_URL}${MARKET_ENDPOINT}`;
        break;
      case 'islands':
        endpoint = `${API_BASE_URL}${CALENDAR_ENDPOINT}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // API 응답 자세히 확인
    console.log('Raw API Response:', JSON.stringify(data.slice(0, 2), null, 2));
    
    switch (type) {
      case 'calendar':
        // 카오스 게이트와 필드 보스만 필터링
        const dailyEvents = data.filter((event: any) => {
          const isValidCategory = 
            event.CategoryName === "카오스게이트" || 
            event.CategoryName === "필드보스" ||
            event.CategoryName === "로웬" ||
            event.CategoryName === "카제로스";
          
          if (isValidCategory) {
            console.log('Found valid event:', {
              name: event.ContentsName,
              category: event.CategoryName,
              times: event.StartTimes
            });
          }
          
          return isValidCategory;
        });

        console.log('Number of filtered events:', dailyEvents.length);
        return NextResponse.json(dailyEvents);
        
      case 'islands':
        // 모험 섬만 필터링
        const islandEvents = data.filter((event: any) => 
          event.CategoryName === "모험 섬"
        );
        return NextResponse.json(islandEvents);

      case 'market':
        // 거래소 API 호출
        const marketEndpoint = `${API_BASE_URL}/markets/items`;
        const searchParams = new URLSearchParams(request.url.split('?')[1]);
        const itemName = searchParams.get('itemName');

        if (!itemName) {
          return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
        }

        const marketResponse = await fetch(marketEndpoint, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'authorization': `bearer ${process.env.LOST_ARK_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Sort: 'GRADE',
            CategoryCode: 50000,  // 전체 카테고리
            CharacterClass: '',
            ItemGrade: '',
            ItemName: itemName,
            PageNo: 1,
            SortCondition: 'ASC'
          })
        });

        if (!marketResponse.ok) {
          console.error('Market API Error:', await marketResponse.text());
          throw new Error(`Market API request failed with status ${marketResponse.status}`);
        }

        const marketData = await marketResponse.json();
        return NextResponse.json(marketData);
        
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Lost Ark API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Lost Ark API' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { endpoint, body } = await request.json();
    console.log('POST request received:', { endpoint, body });

    if (endpoint === 'market') {
      const { itemName } = body;
      console.log('Searching for item:', itemName);

      if (!itemName) {
        return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
      }

      // 아이템 종류에 따른 CategoryCode와 ItemGrade 설정
      let categoryCode = 40000; // 기본값: 각인서
      let itemGrade = '유물'; // 기본값: 유물

      if (itemName.includes('운명의 파괴석') || itemName.includes('정제된 파괴강석') || itemName.includes('운명의 수호석') || itemName.includes('정제된 수호강석') || itemName.includes('운명의 돌파석') || itemName.includes('찬란한 명예의 돌파석') || itemName.includes('운명의 파편 주머니(소)') || itemName.includes('운명의 파편 주머니(중)') || itemName.includes('운명의 파편 주머니(대)') || itemName.includes('아비도스 융화 재료') || itemName.includes('최상급 오레하 융화 재료')) {
        categoryCode = 50010; // 재련 재료
        itemGrade = ''; // 등급 무관
      } else if (itemName.includes('용암의 숨결') || itemName.includes('빙하의 숨결')) {
        categoryCode = 50020;
        itemGrade = ''; // 등급 무관
      }

      const requestBody = {
        Sort: 'GRADE',
        CategoryCode: categoryCode,
        CharacterClass: '',
        ItemGrade: itemGrade,
        ItemName: itemName,
        PageNo: 1,
        SortCondition: 'ASC'
      };

      console.log('Sending request to Lost Ark API:', {
        endpoint: 'https://developer-lostark.game.onstove.com/markets/items',
        body: requestBody
      });

      const response = await fetch('https://developer-lostark.game.onstove.com/markets/items', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'authorization': `bearer ${process.env.LOST_ARK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Market API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        return NextResponse.json({ error: errorText }, { status: response.status });
      }

      const data = await response.json();
      console.log('Market API response:', data);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

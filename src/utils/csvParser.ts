import { ClothingItem } from '../types';

// Функция для парсинга CSV строки
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Функция для парсинга CSV файла
export function parseCSV(csvContent: string): ClothingItem[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Получаем заголовки
  const headers = parseCSVLine(lines[0]);
  
  // Создаем маппинг индексов колонок
  const columnIndexes = {
    id: headers.indexOf('id'),
    gender: headers.indexOf('gender'),
    masterCategory: headers.indexOf('masterCategory'),
    subCategory: headers.indexOf('subCategory'),
    articleType: headers.indexOf('articleType'),
    baseColour: headers.indexOf('baseColour'),
    season: headers.indexOf('season'),
    year: headers.indexOf('year'),
    usage: headers.indexOf('usage'),
    productDisplayName: headers.indexOf('productDisplayName'),
    filename: headers.indexOf('filename'),
    link: headers.indexOf('link'),
    path: headers.indexOf('path'),
    main_style: headers.indexOf('main_style'),
    secondary_style: headers.indexOf('secondary_style'),
  };

  // Парсим данные
  const items: ClothingItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length >= headers.length) {
      const item: ClothingItem = {
        id: values[columnIndexes.id] || '',
        gender: values[columnIndexes.gender] || '',
        masterCategory: values[columnIndexes.masterCategory] || '',
        subCategory: values[columnIndexes.subCategory] || '',
        articleType: values[columnIndexes.articleType] || '',
        baseColour: values[columnIndexes.baseColour] || '',
        season: values[columnIndexes.season] || '',
        year: values[columnIndexes.year] || '',
        usage: values[columnIndexes.usage] || '',
        productDisplayName: values[columnIndexes.productDisplayName] || '',
        filename: values[columnIndexes.filename] || '',
        link: values[columnIndexes.link] || '',
        path: values[columnIndexes.path] || '',
        main_style: values[columnIndexes.main_style] || '',
        secondary_style: values[columnIndexes.secondary_style] || '',
      };
      
      items.push(item);
    }
  }
  
  return items;
}

// Функция для загрузки CSV файла
export async function loadClothingData(): Promise<ClothingItem[]> {
  try {
    // В реальном приложении здесь будет загрузка из файла
    // Для демонстрации используем встроенные данные
    const csvData = `id,gender,masterCategory,subCategory,articleType,baseColour,season,year,usage,productDisplayName,filename,link,path,main_style,secondary_style
1,Men,Apparel,Topwear,T-Shirts,Blue,Summer,2023,Casual,"Nike Men Blue T-Shirt",nike_blue_tshirt.jpg,https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400,nike_blue.jpg,casual fashion,sportswear
2,Women,Apparel,Bottomwear,Jeans,Black,Winter,2023,Casual,"Levi's Women Black Jeans",levis_black_jeans.jpg,https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400,levis_black.jpg,casual fashion,smart casual
3,Unisex,Apparel,Topwear,Hoodies,Gray,Fall,2023,Casual,"Adidas Unisex Gray Hoodie",adidas_gray_hoodie.jpg,https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400,adidas_gray.jpg,sportswear,casual fashion
4,Men,Apparel,Topwear,Shirts,White,Spring,2023,Formal,"H&M Men White Shirt",hm_white_shirt.jpg,https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400,hm_white.jpg,formal wear,smart casual
5,Women,Apparel,Bottomwear,Skirts,Red,Summer,2023,Party,"Zara Women Red Skirt",zara_red_skirt.jpg,https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400,zara_red.jpg,party outfit,casual fashion
6,Men,Apparel,Topwear,Jackets,Black,Winter,2023,Formal,"Hugo Boss Men Black Jacket",hugo_boss_black.jpg,https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400,hugo_boss.jpg,formal wear,smart casual
7,Women,Apparel,Topwear,Dresses,Pink,Spring,2023,Party,"Mango Women Pink Dress",mango_pink.jpg,https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400,mango_pink.jpg,party outfit,casual fashion
8,Unisex,Apparel,Topwear,Sweaters,Green,Fall,2023,Casual,"Uniqlo Unisex Green Sweater",uniqlo_green.jpg,https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400,uniqlo_green.jpg,casual fashion,home wear
9,Men,Apparel,Bottomwear,Shorts,Blue,Summer,2023,Sports,"Nike Men Blue Shorts",nike_shorts.jpg,https://images.unsplash.com/photo-1506629905607-0a2a0b0b0b0b?w=400,nike_shorts.jpg,sportswear,casual fashion
10,Women,Apparel,Topwear,Blouses,White,Spring,2023,Formal,"Zara Women White Blouse",zara_white.jpg,https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400,zara_white.jpg,formal wear,smart casual`;

    return parseCSV(csvData);
  } catch (error) {
    console.error('Error loading clothing data:', error);
    return [];
  }
}
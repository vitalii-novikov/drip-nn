# 🚀 Быстрый старт DripNN Mobile

## Установка и запуск

### 1. Установка зависимостей
```bash
cd dripnn-mobile
npm install
```

### 2. Запуск в режиме разработки
```bash
npm start
```

### 3. Запуск на устройстве
- Установите Expo Go на ваш телефон
- Отсканируйте QR код, который появится в терминале
- Или запустите на эмуляторе:
  ```bash
  # Android
  npm run android
  
  # iOS (требует macOS)
  npm run ios
  ```

## 📱 Тестирование функций

### Swipe Screen (Главная)
1. Откройте приложение
2. Увидите карточки вещей
3. Свайпайте влево (дизлайк) или вправо (лайк)
4. Нажмите "Filters" для настройки фильтров
5. Когда вещи закончатся, увидите сообщение "No more items"

### Profile Screen
1. Перейдите на вкладку "Profile"
2. Нажмите "Create Profile" для создания профиля
3. Введите никнейм и опциональный пароль
4. Просматривайте статистику стилей и лайкнутые вещи
5. Переключайтесь между "Liked" и "Disliked" вещами

### My Item Screen
1. Перейдите на вкладку "My Item"
2. Нажмите "Choose from Gallery" или "Take Photo"
3. Выберите/сделайте фото
4. Нажмите "Get Style Predictions"
5. Увидите 3 предсказанных стиля

## 🔧 Настройка

### Переменные окружения
Файл `.env` уже настроен с базовым URL API:
```
EXPO_PUBLIC_API_URL=https://dripnn-backend-26909090947.europe-west1.run.app
```

### Разрешения
Приложение запросит разрешения на:
- Камеру (для съемки фото)
- Галерею (для выбора фото)
- Хранение (для кэширования данных)

## 🐛 Решение проблем

### Ошибки компиляции
```bash
# Очистка кэша
npx expo start --clear

# Переустановка зависимостей
rm -rf node_modules package-lock.json
npm install
```

### Проблемы с API
- Проверьте подключение к интернету
- Убедитесь, что backend доступен
- Проверьте URL в `.env` файле

### Проблемы с навигацией
- Убедитесь, что все экраны импортированы правильно
- Проверьте, что UserProvider обертывает AppNavigator

## 📊 Структура данных

### Пользователь
```typescript
interface User {
  id: number;           // Автогенерируемый ID
  nickname?: string;    // Опциональный никнейм
  password?: string;    // Опциональный пароль
}
```

### Вещь
```typescript
interface Item {
  id: number;
  link: string;         // URL изображения
  name: string;         // Название
  description: string;   // Описание
  gender?: 'Male' | 'Female';
  category?: 'Topwear' | 'Bottomwear';
  season?: 'Fall' | 'Summer' | 'Winter' | 'Spring';
}
```

## 🔄 API Endpoints

- `GET /items` - получение списка вещей
- `POST /feedback` - отправка лайка/дизлайка
- `POST /embeddings` - загрузка фото для анализа

## 📱 Поддерживаемые платформы

- ✅ iOS 13+
- ✅ Android 8+
- ✅ Expo Go (для разработки)
- ✅ Standalone builds (для продакшена)

## 🎯 Следующие шаги

1. Протестируйте все функции
2. Настройте backend API
3. Создайте production build
4. Опубликуйте в App Store/Google Play
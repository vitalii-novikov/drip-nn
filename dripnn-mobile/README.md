# DripNN Mobile App

Кроссплатформенное мобильное приложение для анализа стиля одежды, интегрированное с FastAPI backend.

## 🚀 Возможности

- **Swipe Screen**: Просмотр вещей с возможностью лайков/дизлайков
- **Profile Screen**: Управление профилем и просмотр предпочтений
- **My Item Screen**: Загрузка фото для анализа стиля
- **Фильтры**: По полу, категории и сезону
- **Кэширование**: Локальное сохранение просмотренных вещей
- **Анонимные пользователи**: Работа без регистрации

## 🛠 Технологии

- React Native (Expo SDK 54)
- TypeScript
- React Navigation (Bottom Tabs)
- AsyncStorage для кэширования
- Axios для API запросов
- React Native Deck Swiper
- Expo Image Picker

## 📱 Установка и запуск

### Предварительные требования

- Node.js 18+
- npm или yarn
- Expo CLI
- Expo Go app на устройстве (для тестирования)

### Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd dripnn-mobile
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения:
```bash
# .env файл уже создан с базовым URL
EXPO_PUBLIC_API_URL=https://dripnn-backend-26909090947.europe-west1.run.app
```

### Запуск

1. Запустите Metro bundler:
```bash
npm start
```

2. Отсканируйте QR код в Expo Go app или запустите на эмуляторе:
```bash
# iOS (требует macOS)
npm run ios

# Android
npm run android
```

## 🏗 Архитектура

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── ItemCard.tsx
│   ├── FilterModal.tsx
│   ├── StyleDistribution.tsx
│   └── LikedItemsGallery.tsx
├── context/             # React Context для состояния
│   └── UserContext.tsx
├── hooks/               # Кастомные хуки
│   ├── useItemCache.ts
│   └── useFeedback.ts
├── navigation/          # Навигация
│   └── AppNavigator.tsx
├── screens/            # Экраны приложения
│   ├── SwipeScreen.tsx
│   ├── ProfileScreen.tsx
│   └── MyItemScreen.tsx
├── services/           # API сервисы
│   └── api.ts
└── types/              # TypeScript типы
    └── index.ts
```

## 🔧 API Интеграция

Приложение интегрировано с FastAPI backend:

- `GET /items` - получение списка вещей
- `POST /feedback` - отправка лайков/дизлайков
- `POST /embeddings` - загрузка фото для анализа стиля

## 📱 Экраны

### 1. Swipe Screen (Главная)
- Карточки вещей с фото, названием и описанием
- Свайпы влево/вправо для дизлайка/лайка
- Фильтры по полу, категории и сезону
- Кэширование просмотренных вещей

### 2. Profile Screen
- Создание/редактирование профиля
- Анонимные пользователи
- Статистика предпочтений стиля
- Галерея лайкнутых/дизлайкнутых вещей

### 3. My Item Screen
- Загрузка фото из галереи или камеры
- Анализ стиля через AI
- Отображение 3 предсказанных стилей

## 🔐 Управление пользователями

- **Анонимные пользователи**: Автоматическая генерация user_id
- **Зарегистрированные пользователи**: Никнейм + опциональный пароль
- **Локальное хранение**: AsyncStorage для данных пользователя
- **Синхронизация**: Все действия сохраняются локально и отправляются на сервер

## 🎨 Дизайн

- Минималистичный дизайн
- Современный UI с градиентами и тенями
- Адаптивная верстка для разных размеров экранов
- Интуитивная навигация через нижнее меню

## 🚀 Развертывание

### Development Build
```bash
# Создание development build
expo build:android
expo build:ios
```

### Production Build
```bash
# Создание production build
expo build:android --release-channel production
expo build:ios --release-channel production
```

## 📝 Лицензия

MIT License

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Создайте Pull Request

## 📞 Поддержка

Для вопросов и поддержки обращайтесь к разработчикам проекта.
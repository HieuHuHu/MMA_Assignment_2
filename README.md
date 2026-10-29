# Shoply — Ứng dụng mua sắm

Shoply là ứng dụng mobile Expo React Native cho Assignment 2. Ứng dụng lấy sản phẩm từ DummyJSON, hỗ trợ phân trang vô hạn, tìm kiếm, xem chi tiết và quản lý giỏ hàng dùng chung giữa các màn hình.

## Công nghệ

- Expo SDK 58, React Native và JavaScript.
- React Navigation Native Stack.
- `FlatList` với `onEndReached` cho danh sách và phân trang.
- React Context API cùng custom hook `useCart()` cho trạng thái giỏ hàng.
- AsyncStorage để khôi phục giỏ hàng sau khi mở lại ứng dụng.
- DummyJSON Products API: <https://dummyjson.com/products>.

## Cấu trúc chính

```text
App.js
src/
  components/  CartButton, CartItem, LoadingView, PriceSummary, ProductCard, SearchBar
  context/     CartContext
  hooks/       useCart
  navigation/  AppNavigator
  screens/     ProductListScreen, ProductDetailScreen, CartScreen
  services/    productApi
```

## Cài đặt và chạy

Cần cài Node.js LTS và Expo Go trên điện thoại, hoặc chuẩn bị Android Emulator.

```bash
npm install
npx expo start
```

Quét QR bằng Expo Go hoặc nhấn `a` để mở Android Emulator. Nếu Expo báo package chưa đúng phiên bản SDK, chạy:

```bash
npx expo install --fix
```

## Tính năng và cách kiểm tra

1. Mở app khi có kết nối internet; danh sách được tải theo trang 10 sản phẩm từ `https://dummyjson.com/products?limit=10&skip=0`.
2. Cuộn xuống cuối danh sách để tải trang tiếp theo. Mỗi trang được ghép theo ID và ngừng tải khi đã nhận đủ `total` sản phẩm.
3. Nhập từ khóa để tìm qua endpoint `/products/search`; tìm kiếm có debounce 400 ms, phân trang riêng và hủy request cũ khi đổi từ khóa.
4. Chạm thẻ sản phẩm để mở chi tiết. Chạm “Thêm vào giỏ hàng” để thêm sản phẩm; thêm lại cùng sản phẩm sẽ tăng số lượng.
5. Mở biểu tượng giỏ trên header, dùng nút cộng/trừ hoặc nút xóa. Tổng số lượng và tổng tiền được tính trực tiếp từ cart items; quantity không giảm dưới 1.
6. Thoát và mở lại ứng dụng để kiểm tra giỏ hàng được khôi phục từ AsyncStorage.
7. Khi mất mạng, màn hình hiển thị thông báo và nút thử lại; có thể kiểm tra trạng thái rỗng bằng từ khóa không có kết quả hoặc giỏ chưa có sản phẩm.

Giỏ hàng nằm trong `CartProvider`, bọc toàn bộ NavigationContainer. `useCart()` cung cấp `cartItems`, thao tác thêm/xóa/tăng/giảm/cập nhật/xóa toàn bộ, `cartItemCount`, `distinctItemCount`, `cartTotal` và `isCartReady`. Tổng tiền và số lượng được suy ra từ items để không lệch trạng thái.

## Đưa source lên GitHub

Tạo repository GitHub trống, sau đó chạy tại thư mục dự án:

```bash
git init
git add .
git commit -m "Build Shoply e-commerce app"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/<ten-repository>.git
git push -u origin main
```

Thay `<tai-khoan>` và `<ten-repository>` bằng thông tin repository của bạn. Chưa có repository hoặc link GitHub nào được tạo trong bài này.

## Build APK bằng EAS (tùy chọn)

Cài EAS CLI, đăng nhập tài khoản Expo và cấu hình project:

```bash
npm install --global eas-cli
eas login
eas build:configure
```

Đặt cấu hình Android APK (ví dụ profile `preview`) trong `eas.json`:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    }
  }
}
```

Sau đó chạy `eas build --platform android --profile preview`. EAS sẽ yêu cầu đăng nhập và tải mã nguồn lên dịch vụ build; xem lại thông tin trước khi xác nhận. Sau khi build hoàn tất, dùng link APK do EAS cung cấp để nộp. APK chưa được build trong workspace này.

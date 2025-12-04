export enum OrderStatus {
  PENDING = 'PENDING', // تم إنشاء الطلب لكن لم يتم الدفع بعد
  PAID = 'PAID', // تم الدفع
  SHIPPED = 'SHIPPED', // تم شحن الطلب
  DELIVERED = 'DELIVERED', // تم التوصيل
  COMPLETED = 'COMPLETED', // بعد انتهاء فترة الإرجاع / إغلاق الطلب
  CANCELED = 'CANCELED', // تم إلغاء الطلب
  RETURNED = 'RETURNED', // تم إرجاع الطلب
}

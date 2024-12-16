class OrderAPI {
   constructor(baseURL) {
      this.baseURL = baseURL;
   }

   async createOrder(orderData) {
      try {
         const response = await fetch(`${this.baseURL}/orders`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
         });

         if (!response.ok) {
            throw new Error(`Ошибка при создании заказа: ${response.statusText}`);
         }

         const result = await response.json();
         console.log('Заказ создан:', result);
         return result; // Возвращаем данные заказа с его номером
      } catch (error) {
         console.error('Ошибка:', error);
         throw error;
      }
   }

   async getOrders() {
      try {
         const response = await fetch(`${this.baseURL}/orders`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         });

         if (!response.ok) {
            throw new Error(`Ошибка при получении заказов: ${response.statusText}`);
         }

         const orders = await response.json();
         console.log('История заказов:', orders);
         return orders;
      } catch (error) {
         console.error('Ошибка:', error);
         throw error;
      }
   }

   async deleteOrder(orderId) {
      try {
         const response = await fetch(`${this.baseURL}/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
         });

         if (!response.ok) {
            throw new Error(`Ошибка при удалении заказа: ${response.statusText}`);
         }

         console.log(`Заказ с ID ${orderId} успешно удален`);
         return true; // Возвращаем true в случае успеха
      } catch (error) {
         console.error('Ошибка:', error);
         throw error;
      }
   }
}

const orderAPI = new OrderAPI('https://jsonplaceholder.typicode.com');

const newOrder = {
   userId: 1,
   title: 'Новый заказ',
   body: 'Детали нового заказа',
};
orderAPI.createOrder(newOrder).then((data) => console.log('Созданный заказ:', data));

orderAPI.getOrders().then((orders) => console.log('Заказы:', orders));

const orderIdToDelete = 1;
orderAPI.deleteOrder(orderIdToDelete).then(() => console.log('Заказ удален'));

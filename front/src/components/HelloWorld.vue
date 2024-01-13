<template>
  <div class="lg:container pa-4 mx-auto">
    <div class="flex gap-4">
      <div class="pa-4 rd-4 shadow-xl grid gap-4 w-20rem mb-8">
        <h1 class="text-xl font-bold">{{ isEdit ? 'Editar' : 'Crear' }} Producto</h1>
        <div>
          <label for="name">Producto: </label>
          <input class="w-full py-1 px-2 rd-2 b-1 b-gray-700 outline-none" type="text" id="name" v-model="product.name">
        </div>
        <div>
          <label for="price">Precio: </label>
          <input class="w-full py-1 px-2 rd-2 b-1 b-gray-700 outline-none" type="number" id="price"
            v-model="product.price">
        </div>
        <div>
          <label for="mark">Marca: </label>
          <input class="w-full py-1 px-2 rd-2 b-1 b-gray-700 outline-none" type="text" id="mark" v-model="product.mark">
        </div>
        <button class="py-2 px-4 rd-2 bg-green-500 c-white hover:bg-green-700 transition-colors" v-if="!isEdit"
          @click="createProduct">Crear Producto</button>
        <button class="py-2 px-4 rd-2 bg-green-500 c-white hover:bg-green-700 transition-colors" v-else
          @click="updateProduct">Editar Producto</button>
      </div>
      <hi class="w-full text-4xl flex items-center justify-end font-bold">
        Mantenimiento de productos
      </hi>
    </div>

    <div class="mb-4">
      <h1 class="text-center text-2xl font-bold mb-4">Productos</h1>
      <table class="w-full text-gray-500">
        <thead class="text-gray-700 uppercase bg-gray-50">
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Marca</th>
            <th class="w-8rem"></th>
            <th class="w-8rem"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id"
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b">
            <td class="text-center">{{ product.name }}</td>
            <td class="text-center">${{ product.price }} USD</td>
            <td class="text-center">{{ product.mark }}</td>
            <td class="text-center">
              <button class="py-1 px-3 rd-2 bg-blue-500 c-white hover:bg-blue-700 transition-colors"
                @click="editProduct(product)">Actualizar</button>
            </td>
            <td class="text-center">
              <button class="py-1 px-3 rd-2 bg-red-500 c-white hover:bg-red-700 transition-colors"
                @click="deleteProduct(product._id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEdit: false,
      products: [],
      product: {
        name: '',
        price: null,
        mark: ''
      }
    };
  },
  async created() {
    try {
      const response = await fetch('http://localhost:3200/api/products');
      if (!response.ok) {
        throw new Error('Error al acceder a la BD');
      }
      const data = await response.json();
      this.products = data;
    }
    catch (error) {
      console.log(error);
    }
  },
  methods: {

    async createProduct() {
      console.log('Intentando crear producto:', this.product);
      try {
        const response = await fetch('http://localhost:3200/api/product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.product),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error('Error al crear producto: ' + errorData.message);
        }

        const responseData = await response.json();
        console.log('Producto creado: ', responseData);
        this.products.push(responseData);
        this.resetForm();
      } catch (error) {
        console.error('Error en createProduct:', error);
      }
    },

    editProduct(product) {
      this.product = { ...product }
      this.isEdit = true
    },

    async updateProduct() {
      console.log('Intentando crear producto:', this.product);
      try {
        const response = await fetch(`http://localhost:3200/api/product/${this.product._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.product),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error('Error al editar producto: ' + errorData.message);
        }

        const responseData = await response.json();
        console.log('Producto actualizado: ', responseData);
        this.products = this.products.map((product) => {
          if (product._id == this.product._id) {
            product = this.product
          }
          return product
        })
        this.resetForm();
      } catch (error) {
        console.error('Error en updateProduct:', error);
      }
      this.isEdit = false
    },
    async deleteProduct(productId) {
      console.log(productId);
      if (confirm('¿Estas seguro de eliminar este producto?')) {
        try {
          const response = await fetch(`http://localhost:3200/api/product/${productId}`, {
            method: 'DELETE'
          });
          if (!response.ok) {
            throw new Error('Error al eliminar producto');
          }
          this.products = this.products.filter(product => product._id !== productId);
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }
    },
    resetForm() {
      this.product = {
        name: '',
        mark: '',
        price: null
      }
    }
  }




}
</script>

<style></style>

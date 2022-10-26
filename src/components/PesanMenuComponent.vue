<template class="justify-center px-10">
    <v-main class="list justify-center">
        <div class="d-flex justify-space-between ma-4">
          <div style="width:10%"></div>
          <h2 class="text-center">
            SIKafe
          </h2>
          <v-icon class="d-flex" @click="cartHandler()">
            mdi-cart
          </v-icon>
        </div>
        <div class="d-flex justify-space-between pa-4">
          <div style="width:20%">
          </div>
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              class="d-flex justify-space-around mb-10"
              label="Search"
              single-line
              hide-details
              @keydown.enter="searchMenu(search)"
          ></v-text-field>
          <div style="width:20%">
          </div>
        </div>
        <v-flex v-for="item in menus" :key="item.id">
          <v-card class="text-xs ma-4 cards"
                  :style="{
                      background: '#ffffff'
                  }">
            <div class="row" @click="tambahHandler(item)">
              <div class="col-3">
                <v-img
                  :src='showPic(item)'
                  class="fotoMenu"
                />
              </div>
              <div class="col-9">
                <v-list-item-content class="pa-2 mt-2">
                  <v-list-item-title> <b>{{ item.nama_menu }} &dash; Rp.{{ item.harga_menu }}</b></v-list-item-title>
                  <v-list-item-subtitle >{{ item.deskripsi_menu }}</v-list-item-subtitle>
                </v-list-item-content>
              </div>
            </div>
          </v-card>
        </v-flex>

        <v-dialog v-model="dialogTambah" max-width="800px">
          <v-card>
            <v-card-text class="font pt-4">
              <h1
                class="text--primary mb-6">
                {{ form.nama_menu }}
              </h1>
              <v-img :src="showPic(form)"
                class="mx-auto pa-4"
                max-height="400px"
                max-width="400px"></v-img>
              <v-divider
                class="mt-4"
                max-width="80%"
              ></v-divider>
              <v-list-item-subtitle class="my-4">{{ form.deskripsi_menu }}</v-list-item-subtitle>
              <v-list-item-subtitle><b> Rp.{{ form.harga_menu }}/porsi</b></v-list-item-subtitle>
              <v-spacer></v-spacer>
              <v-row
                class="justify-space-between pa-2">
                  <v-col
                    class="text-align-center ml-1"
                    style="font-size:18px"
                    >
                    Jumlah :
                  </v-col>
                  <v-col
                    class="text-center d-flex justify-center"
                    style="font-size:20px"
                    >
                    <v-icon medium class="mr-6" @click="countTemp('Tambah', form)">
                      mdi-plus
                    </v-icon>
                    {{ form.jumlah_menu }}
                    <v-icon v-if="form.jumlah_menu === 0" disable medium class="ml-6">
                      mdi-minus
                    </v-icon>
                    <v-icon v-else-if="form.jumlah_menu === 1 && inputType === 'Ubah'" medium class="ml-6" @click="dialogConfirm = true">
                      mdi-minus
                    </v-icon>
                    <v-icon v-else-if="form.jumlah_menu > 0" medium class="ml-6" @click="countTemp('Kurang', form)">
                      mdi-minus
                    </v-icon>
                  </v-col>
                  <v-col></v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancel">
                    Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="setForm(form.jumlah_menu)">
                    Add to Cart
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCart"
          max-width="1000px"
          width="80%">
          <v-card class="pa-2">
            <v-card-title>
              Pesanan Anda
            </v-card-title>
            <v-text-field
              v-model="form.nama_pembeli"
              label="Nama Customer"
              required
              class="ma-8"
            ></v-text-field>

            <v-flex v-for="item in cart" :key="item.id">
              <v-card
                class="text-xs ma-4 cards"
                elevation="0"
                outlined>
                <div class="row">
                  <div class="col-3">
                    <v-img
                      :src='showPic(item)'
                      class="fotoMenu"
                    />
                  </div>
                  <div class="col-3 d-flex ma-auto pa-auto">
                    <v-list-item-content class="pa-2">
                      <v-list-item-title>
                        <b>{{ item.nama_menu }}</b><br/><br/>
                        <b> Rp.{{ item.harga_menu }}</b>
                      </v-list-item-title>
                    </v-list-item-content>
                  </div>
                  <div class="col-2 d-flex ma-auto pa-auto">
                    <v-list-item-subtitle>
                      <v-col class="col d-flex justify-center align-text-center mt-4">
                        <b>Jumlah :</b>
                      </v-col>
                      <v-col class="col d-flex justify-center align-text-center mb-5">
                        x {{ item.jumlah_menu }}
                      </v-col>
                    </v-list-item-subtitle>
                  </div>
                  <div class="col-4 d-flex ma-auto pa-auto">
                    <v-list-item-subtitle>
                      <div class="row">
                        <v-col class="col">
                          <v-btn class="ml-4" @click="editHandler(item)">
                            Edit
                          </v-btn>
                        </v-col>
                        <v-col class="col">
                          <v-icon medium :color="'red'" class="mr-2 ml-2" @click="deleteHandler()">
                            mdi-delete
                          </v-icon>
                        </v-col>
                      </div>
                    </v-list-item-subtitle>
                  </div>
                </div>
              </v-card>
            </v-flex>
            <!-- <v-data-table
              :items="cart" :headers="cartHeaders">
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="tambahHandler(item.id, item)">
                  mdi-pencil
                </v-icon>
                <v-icon small class="mr-2" @click="deleteHandler()">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table> -->
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                  <span class="headline">Warning!!!</span>
                </v-card-title>
                <v-card-text>
                    Anda yakin ingin menghapus transaksi?
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cancel">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="deleteHandler()">
                    Yes
                  </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="4000" bottom>
            {{error_message}}
        </v-snackbar>
    </v-main>
</template>

<script>
export default {
  name: 'pesan-component',
  data () {
    return {
      inputType: 'Tambah',
      radioGroup: 'Show All',
      load: false,
      snackbar: false,
      error_message: '',
      err_jumlah: 'Jumlah harus lebih dari 0',
      color: '',
      showed: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogTambah: false,
      dialogCart: false,
      headers: [
        {
          text: 'Nama Menu',
          align: 'start',
          sortable: true,
          value: 'nama_menu'
        },
        { text: 'Harga', value: 'harga_menu' },
        { text: 'Foto', value: 'foto_menu' },
        { text: 'Deskripsi', value: 'deskripsi_menu' },
        { text: 'Jenis', value: 'jenis_menu' },
        { text: 'Actions', value: 'actions' }
      ],
      cartHeaders: [
        { text: 'Foto', value: 'foto_menu' },
        {
          text: 'Nama Menu',
          align: 'start',
          sortable: true,
          value: 'nama_menu'
        },
        { text: 'Harga', value: 'harga_menu' },
        { text: 'Deskripsi', value: 'deskripsi_menu' },
        { text: 'Jenis', value: 'jenis_menu' },
        { text: 'Jumlah', value: 'jumlah_menu' },
        { text: 'Actions', value: 'actions' }
      ],
      jenisMenu: [
        'Kopi',
        'Non-Kopi',
        'Makanan'
      ],
      menu: new FormData(),
      menus: [],
      cart: [],
      form: {
        nama_pembeli: null,
        nama_menu: null,
        harga_menu: null,
        foto_menu: null,
        deskripsi_menu: null,
        jenis_menu: null,
        jumlah_menu: 0
      },
      deleteId: '',
      editId: '',
      tambahId: '',
      uploadNama_menu: ''
    }
  },
  methods: {
    // read data menu
    readData () {
      const url = this.$api + '/customer'
      this.$http.get(url, {
      }).then(response => {
        this.menus = response.data.data
        console.log(this.cart)
      })
    },
    // read not deleted
    searchMenu (name) {
      const url = this.$api + '/customer/search=' + name
      this.$http.get(url, {
      }).then(response => {
        this.menus = response.data.data
      })
    },
    showPic (menu) {
      if (!(menu.foto_menu === null)) {
        return this.$urlFoto + menu.foto_menu
      } else {
        return this.$urlFoto + 'menu_picture/image-remove.png'
      }
    },
    countTemp (value, item) {
      if (value === 'Tambah') {
        item.jumlah_menu = item.jumlah_menu + 1
      } else if (value === 'Kurang' && item.jumlah_menu > 0) {
        item.jumlah_menu = item.jumlah_menu - 1
      }
    },
    setForm (jumlah) {
      if (jumlah !== 0 && this.inputType === 'Tambah') {
        if (this.cart.length === 0) {
          this.cart.push(this.form)
        } else {
          for (let i = 0; i < this.cart.length; i++) {
            if (this.cart[i].nama_menu === this.form.nama_menu) {
              this.cart[i].jumlah_menu = this.cart[i].jumlah_menu + jumlah
              break
            } else if (i === this.cart.length - 1) {
              this.cart.push(this.form)
              break
            }
          }
        }
        this.cancel()
      } else if (this.inputType === 'Ubah') {
        for (let j = 0; j < this.cart.length; j++) {
          if (this.cart[j].nama_menu === this.form.nama_menu) {
            this.cart[j].jumlah_menu = jumlah
          }
        }
      }
    },
    // simpan data produk
    save () {
      this.menu.append('nama_menu', this.form.nama_menu)
      this.menu.append('harga_menu', this.form.harga_menu)
      this.menu.append('deskripsi_menu', this.form.deskripsi_menu)
      this.menu.append('jenis_menu', this.form.jenis_menu)

      const url = this.$api + '/pesanan'
      this.load = true
      this.$http.post(url, this.menu, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    // ubah data produk
    update () {
      const newData = {
        nama_menu: this.form.nama_menu,
        harga_menu: this.form.harga_menu,
        deskripsi_menu: this.form.deskripsi_menu,
        jenis_menu: this.form.jenis_menu
      }
      const url = this.$api + '/menu/' + this.editId
      this.load = true
      this.$http.put(url, newData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    // restore data produk
    restoreData () {
      const url = this.$api + '/menu/restore/' + this.deletedId
      this.$http.put(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    ETHandler (item) {
      this.form.nama_menu = item.nama_menu
      this.form.harga_menu = item.harga_menu
      this.form.foto_menu = item.foto_menu
      this.form.deskripsi_menu = item.deskripsi_menu
      this.form.jenis_menu = item.jenis_menu
    },
    cartHandler () {
      this.dialogCart = true
    },
    editHandler (item) {
      this.inputType = 'Ubah'
      this.form.jumlah_menu = item.jumlah_menu
      this.ETHandler(item)
      this.dialogTambah = true
    },
    tambahHandler (item) {
      this.ETHandler(item)
      this.dialogTambah = true
    },
    minusHandler (item) {
      this.ETHandler(item)
      this.dialogConfirm = true
    },
    deleteHandler () {
      for (let j = 0; j < this.cart.length; j++) {
        if (this.cart[j].nama_menu === this.form.nama_menu) {
          this.cart.splice(j, 1)
        }
      }
      this.cancel()
    },
    close () {
      this.dialog = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.dialogUpload = false
      this.inputType = 'Tambah'
      this.tambahId = ''
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogUpload = false
      this.dialogTambah = false
      this.inputType = 'Tambah'
      this.tambahId = ''
    },
    resetForm () {
      this.form = {
        nama_pembeli: null,
        nama_menu: null,
        harga_menu: null,
        foto_menu: null,
        deskripsi_menu: null,
        jenis_menu: null,
        jumlah_menu: 0
      }
      this.$forceUpdate()
    }
  },
  computed: {
    formTitle () {
      return this.inputType
    }
  },
  mounted () {
    this.readData()
  }
}
</script>
<style>
.fotoMenu {
  height: 128px;
  width: 128px;
  min-width: 50px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.cardMenu {
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>

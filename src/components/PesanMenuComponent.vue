<template class="justify-center">
    <v-main class="list justify-center">
        <div class="d-flex justify-space-between mt-4 pt-4">
          <div style="width:10%"></div>
          <h2 class="text-center">
            SIKafe
          </h2>
          <v-icon style="width:10%" class="d-flex" @click="cartHandler()">
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
                  class="fotoMenu alignHorizontal"
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
                <v-btn color="blue darken-1" text @click="close">
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
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation>
            <v-text-field
              v-model="form.nama_pembeli"
              label="Nama Customer"
              required
              class="ma-8"
              :rules="[(v) => !!v || 'Nama tidak boleh kosong']"
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
                      class="fotoMenu alignHorizontal"
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
            <br/>
            <v-card-subtitle><b>Subtotal : {{ this.subtotal }}</b></v-card-subtitle>
            <v-card-subtitle><b>Tax : {{ this.tax }}</b></v-card-subtitle>
            <v-card-subtitle><b>Total Harga : {{ this.totalHarga }}</b></v-card-subtitle>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close()">
                    Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="checkForm()">
                    Pesan
                </v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogNota"
          persistent
          fullscreen>
          <v-card>
            <v-container
              class="pa-lg-12 pa-md-8 pa-sm-6 ma-auto"
              max-width="60%"
              height="100%">
              <v-card-title class="d-flex justify-center align-center mb-8">
                SIKafe
              </v-card-title>
                <v-list-item-title>
                  <v-row class="mb-4 justify-center">
                    <v-col
                      cols="3"
                      class="text-left">
                      <b>Nama Pembeli</b>
                    </v-col>
                    <v-col
                      cols="3"
                      class="text-right">
                      <b>{{ form.nama_pembeli }}</b>
                    </v-col>
                  </v-row>
                  <v-row class="mb-4 justify-center">
                    <v-col
                      cols="3"
                      class="text-left">
                      <b>Tanggal Transaksi</b>
                    </v-col>
                    <v-col
                      cols="3"
                      class="text-right">
                      <b>{{ this.tanggalIni }}</b>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              <v-divider class="d-flex justify-center mx-auto" width="55%"></v-divider>
              <v-flex v-for="item in cart" :key="item.id">
                <div class="row justify-center">
                  <div class="col-3">
                    <v-list-item-content class="text-left">
                      <v-list-item-title>
                        <b>{{ item.nama_menu }}</b><br/><br/>
                        <b>x {{ item.jumlah_menu }}</b>
                      </v-list-item-title>
                    </v-list-item-content>
                  </div>
                  <div class="col-3">
                    <v-list-item-title class="text-right pt-2">
                        <b>Rp. {{ item.harga_menu * item.jumlah_menu }}</b>
                    </v-list-item-title>
                  </div>
                </div>
              </v-flex>
              <v-divider class="d-flex justify-center mx-auto mt-2" width="55%"></v-divider>
              <v-list-item-title class="my-4">
                <v-row class="justify-center">
                  <v-col
                    cols="3"
                    class="text-left">
                    <b>Subtotal</b>
                  </v-col>
                  <v-col
                    cols="3"
                    class="text-right">
                    <b>{{ this.subtotal }}</b>
                  </v-col>
                </v-row>
                <v-row class="justify-center">
                  <v-col
                    cols="3"
                    class="text-left">
                    <b>Tax</b>
                  </v-col>
                  <v-col
                    cols="3"
                    class="text-right">
                    <b>{{ this.tax }}</b>
                  </v-col>
                </v-row>
                <v-row class="justify-center">
                  <v-col
                    cols="3"
                    class="text-left">
                    <b>Total Harga</b>
                  </v-col>
                  <v-col
                    cols="3"
                    class="text-right">
                    <b>{{ this.totalHarga }}</b>
                  </v-col>
                </v-row>
              </v-list-item-title>
              <div class="d-flex justify-center align-end pb-8">
                <v-btn color="success" @click="cancel()">Kembali ke Menu Utama</v-btn>
              </div>
            </v-container>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogLoading"
          persistent
          fullscreen
          hide-overlay>
          <v-container
            fluid
            fill-height
            style="background-color: black; opacity: 40%">
            <v-progress-circular
              indeterminate
              color="primary"
              class="d-flex justify-center align-center ma-auto"
            ></v-progress-circular>
          </v-container>
        </v-dialog>

        <v-dialog v-model="dialogBeforePayment"
          persistent
          fullscreen
          hide-overlay
          style="background-color: white">
          <v-card fill-height class="d-flex justify-center align-center alignVertical">
            <v-row>
              <v-col>
                <v-icon size="75" class="d-flex justify-center align-center" color="green">
                  mdi-check-circle
                </v-icon>
                <br>
                <p
                  class="d-flex justify-center text-center text-h6">
                  Pemesanan Berhasil.<br>Mohon untuk melakukan pembayaran di kasir
                </p>
              </v-col>
            </v-row>
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
                  <v-btn color="blue darken-1" text @click="close()">
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
      valid: false,
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogTambah: false,
      dialogCart: false,
      dialogNota: false,
      dialogLoading: false,
      dialogBeforePayment: false,
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
      pesanan: new FormData(),
      detailPesanan: new FormData(),
      transaksi: new FormData(),
      menus: [],
      detailPesanans: [],
      pesanans: [],
      transaksis: [],
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
      tampungForm: [],
      tampungId: [
        {
          id_menu: 0
        }
      ],
      tampungFull: [[], [], []],
      id_pesanan: null,
      subtotal: 0,
      tax: 0,
      totalHarga: 0,
      deleteId: '',
      editId: '',
      tambahId: '',
      uploadNama_menu: '',
      date: new Date(),
      day: null,
      month: null,
      year: null,
      currentDate: null,
      tanggalIni: null
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
    async readPesanan () {
      const url = this.$api + '/getPesanan'
      this.$http.get(url, {
      }).then(response => {
        this.pesanans = response.data.data
        console.log(this.pesanans)
      })
    },
    readTransaksi () {
      const url = this.$api + '/getTransaksi/' + this.id_pesanan
      this.$http.get(url, {
      }).then(response => {
        this.transaksis = response.data.data
        console.log(this.transaksis)
      })
    },
    searchMenu (name) {
      if (name === null || name === '') {
        this.readData()
      } else {
        const url = this.$api + '/customer/search=' + name
        this.$http.get(url, {
        }).then(response => {
          this.menus = response.data.data
        })
      }
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
    checkForm () {
      if (this.$refs.form.validate()) {
        if (this.form.nama_pembeli) {
          return this.savePesanan()
        }
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
    async waitForPayment () {
      this.dialogLoading = false
      this.dialogBeforePayment = true
      do {
        this.readTransaksi()
        await this.Async()
        await this.Async()
      }
      while (this.transaksis[0].status_pembayaran === 0)
      this.tanggalIni = this.transaksis[0].tanggal_transaksi
      this.dialogBeforePayment = false
      this.dialogNota = true
    },
    sumSubtotal () {
      for (let j = 0; j < this.cart.length; j++) {
        this.subtotal += (this.cart[j].harga_menu * this.cart[j].jumlah_menu)
      }
      this.tax = this.subtotal / 10
      this.totalHarga = this.subtotal + this.tax
    },
    async searchIdPesanan () {
      for (let i = 0; i < this.pesanans.length; i++) {
        if (this.pesanans[i].nama_pembeli === this.form.nama_pembeli) {
          this.id_pesanan = this.pesanans[i].id
        }
      }
    },
    async copyIdMenuAndIdPesanan () {
      await this.searchIdPesanan()
      for (let j = 0; j < this.cart.length; j++) {
        for (let k = 0; k < this.menus.length; k++) {
          if (this.cart[j].nama_menu === this.menus[k].nama_menu) {
            this.tampungForm.push(this.cart[j].jumlah_menu)
            this.tampungForm.push(this.id_pesanan)
            this.tampungForm.push(this.menus[k].id)
          }
        }
      }
      this.detailPesanan.append('data', JSON.stringify(this.tampungForm))
      console.log(this.detailPesanan)
      console.log(this.tampungForm)
    },
    Async () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 2500)
      })
    },
    // simpan data produk
    async savePesanan () {
      this.dialogLoading = true
      this.pesanan.append('nama_pembeli', this.form.nama_pembeli)
      this.pesanan.append('subtotal', this.subtotal)

      const url = this.$api + '/simpanPesanan'
      this.load = true
      await this.$http.post(url, this.pesanan, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        // this.error_message = response.data.message
        // this.color = 'green'
        // this.snackbar = true
        this.load = false
        this.readPesanan()
        // this.saveDetailPesanan()
        // this.resetForm()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
      await this.Async()
      this.saveDetailPesanan()
    },
    async saveDetailPesanan () {
      await this.copyIdMenuAndIdPesanan()
      const url = this.$api + '/detailPesanan'
      this.load = true
      this.$http.post(url, this.detailPesanan, {
      }).then(response => {
        // this.error_message = response.data.message
        // this.color = 'green'
        // this.snackbar = true
        this.load = false
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
      await this.Async()
      this.saveTransaksi()
    },
    async saveTransaksi () {
      this.transaksi.append('total_harga', this.totalHarga)
      this.transaksi.append('id_pesanan', this.id_pesanan)

      const url = this.$api + '/simpanTransaksi'
      this.load = true
      await this.$http.post(url, this.transaksi, {
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
      this.dialogLoading = true
      this.waitForPayment()
      // this.close()
      // this.readData()
      // this.resetForm()
      // this.cart = []
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
      this.sumSubtotal()
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
      this.subtotal = 0
      this.tax = 0
      this.totalHarga = 0
      this.dialog = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.dialogUpload = false
      this.dialogCart = false
      this.dialogNota = false
      this.inputType = 'Tambah'
      this.tambahId = ''
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.subtotal = 0
      this.tax = 0
      this.totalHarga = 0
      this.dialog = false
      this.dialogConfirm = false
      this.dialogUpload = false
      this.dialogTambah = false
      this.dialogCart = false
      this.dialogNota = false
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
    // this.day = this.date.getDate()
    this.day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.date)
    this.month = this.date.getMonth() + 1
    this.year = this.date.getFullYear()
    this.currentDate = `${this.year}-${this.month}-${this.day}`
    this.readPesanan()
    this.searchIdPesanan()
    console.log(this.currentDate)
    console.log(this.pesanans)
    console.log(this.id_pesanan)
  }
}
</script>
<style>
.fotoMenu {
  height: 128px;
  width: 128px;
  min-width: 50px;
  display: block;
}
.cardMenu {
  max-width: 80%;
  display: block;
}
.alignHorizontal {
  margin-left: auto;
  margin-right: auto;
}
.alignVertical {
  margin-top: auto;
  margin-bottom: auto;
}
</style>

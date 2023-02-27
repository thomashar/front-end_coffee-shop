<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Transaksi </h3>

        <v-card>
          <v-card-title>
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              @keydown.enter="searchMenu(search)"
          ></v-text-field>
          <v-spacer></v-spacer>
            <v-btn color="success" dark @click="replaceUrl">
                Tambah
            </v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="transaksisComp"
            :search="search"
            :sort-by="'headers.tanggal_transaksi'"
            :sort-desc="true">
            <template v-slot:[`item.status_pembayaran`]="{ item }">
              <v-list-item-action-text v-if="item.status_pembayaran === '0'" class="mr-2">
                  Menunggu Pembayaran
              </v-list-item-action-text>
              <v-list-item-action-text v-else-if="item.status_pembayaran === '1'" class="mr-2">
                  Sudah Lunas
              </v-list-item-action-text>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="bayarHandler(item)">
                    mdi-cash
                </v-icon>
                <v-icon small class="mr-2" @click="editHandler(item)">
                    mdi-pencil
                </v-icon>
                <v-icon v-if="item.is_Deleted_transaksi === '0'" small class="mr-2" @click="deleteHandler(item)">
                    mdi-delete
                </v-icon>
                <v-icon v-else-if="item.is_Deleted_transaksi === '1'" small class="mr-2" @click="restoreHandler(item)">
                    mdi-restore
                </v-icon>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Transaksi</span>
                </v-card-title>
                <v-container v-if="inputType === 'Ubah' || inputType === 'Bayar'">
                    <v-text-field
                      v-model="form.nama_pembeli"
                      label="Nama Pembeli"
                      required>
                    </v-text-field>
                    <v-row>
                      <v-col>
                        <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="form.tanggal_transaksi"
                              label="Tanggal Transaksi (YYYY-MM-DD)"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                              v-model="form.tanggal_transaksi"
                              @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="3" v-if="this.inputType === 'Ubah'" >
                        <v-btn color="success" dark @click="tambahDetailPesan()">
                            Tambah
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-data-table
                      v-if="inputType === 'Bayar'"
                      :headers="detailpesan"
                      :items="pesanans">
                        <template v-slot:[`item.Jumlah`]>
                          <v-row dense>
                            <v-col
                              cols="12"
                              sm="4"
                              md="3"
                              >
                              <v-card-text
                                class="text-align-center ml-1"
                                >
                                {{pesanans.jumlah_menu}}
                              </v-card-text>
                            </v-col>
                          </v-row>
                        </template>
                    </v-data-table>

                    <v-data-table
                      v-else-if="inputType === 'Ubah'"
                      :headers="detailPesanEdit"
                      :items="pesanans">
                      <v-spacer></v-spacer>
                        <template v-slot:[`item.Jumlah`]="{ item }">
                          <v-row dense>
                            <v-col
                              cols="12"
                              sm="4"
                              md="3"
                              >
                              <v-card-text
                                class="text-align-center ml-1"
                                >
                                {{item.jumlah_menu}}
                              </v-card-text>
                            </v-col>
                          </v-row>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-btn dense @click="editDetailpesan(item, item.id_menu, item.id_detailpesanan)">
                            Edit
                          </v-btn>
                          <v-icon medium :color="'red'" class="mr-2 ml-2" @click="deleteDetailpesan(item)">
                            mdi-delete
                          </v-icon>
                        </template>
                    </v-data-table>

                    <v-col>
                      <b>
                      <v-row class="justify-end">
                        Subtotal : {{ form.subtotal_view }}
                      </v-row>
                      <v-row class="justify-end">
                        Tax : {{ form.tax_view }}
                      </v-row>
                      <v-row class="justify-end">
                        Total : {{ form.total_harga_view }}
                      </v-row>
                      </b>
                    </v-col>

                    <v-text-field
                      v-model="form.nama_pegawai"
                      label="Nama Pegawai">
                    </v-text-field>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogTambah" max-width="800px">
          <v-card>
            <v-card-text class="font pt-4">
              <h1
                class="text--primary mb-6">
                {{ form.nama_menu }}
              </h1>
              <v-list-item-subtitle class="my-4">{{ form.deskripsi_menu }}</v-list-item-subtitle>
              <v-list-item-subtitle><b> Rp {{ form.harga_menu_view }}/porsi</b></v-list-item-subtitle>
              <v-spacer></v-spacer>
              <v-row
                class="justify-space-between pa-2">
                  <v-col
                    class="text-align-center ml-1"
                    style="font-size:18px"
                    >
                    Jumlah :
                  </v-col>
              </v-row>
              <v-row>
                  <v-col
                    class="text-center d-flex justify-center"
                    style="font-size:20px"
                    >
                    <v-icon v-if="form.jumlah_menu === '0'" disable medium class="mr-6">
                      mdi-minus
                    </v-icon>
                    <v-icon v-else-if="form.jumlah_menu > '0'" medium class="mr-6" @click="countTemp('Kurang', form)">
                      mdi-minus
                    </v-icon>
                    {{ form.jumlah_menu }}
                    <v-icon medium class="ml-6" @click="countTemp('Tambah', form)">
                      mdi-plus
                    </v-icon>
                  </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogTambah=false">
                    Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="searchInPesanans()">
                    Save
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEditTambah" max-width="400px">
          <v-container>
            <v-data-table
              :headers="detailPesanTambah"
              :items="menusTemp">
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon small class="mr-2" @click="editDetailpesan(item, item.id)">
                    mdi-plus
                  </v-icon>
                </template>
            </v-data-table>
          </v-container>
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

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                  <span class="headline">Warning!!!</span>
                </v-card-title>
                <v-card-text v-if="statusData === 'Hapus'">
                    Anda yakin ingin menghapus transaksi?
                </v-card-text>
                <v-card-text v-else-if="statusData === 'Restore'">
                    Anda yakin ingin memulihkan transaksi?
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <!-- dibuat if antara hapus transaksi sama hapus detail pesanan -->
                  <v-btn color="blue darken-1" text @click="cancel">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="reverseData">
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
  name: 'transaksi-component',
  data () {
    return {
      inputType: 'Tambah',
      editedDP: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      search: null,
      banyakMenu: false,
      jumlahTemp: 0,
      menu2: false,
      statusData: '',
      dialog: false,
      dialogConfirm: false,
      dialogTambah: false,
      dialogEditTambah: false,
      dialogLoading: false,
      headers: [
        {
          text: 'Nama Pembeli',
          value: 'nama_pembeli'
        },
        {
          text: 'Tanggal Transaksi',
          align: 'start',
          sortable: true,
          value: 'tanggal_transaksi'
        },
        { text: 'Total Harga', value: 'total_harga_view' },
        { text: 'Status Pembayaran', value: 'status_pembayaran' },
        { text: 'Actions', value: 'actions' }
      ],
      detailpesan: [
        {
          text: 'Nama menu',
          align: 'start',
          sortable: true,
          value: 'nama_menu'
        },
        { text: 'Harga Menu', value: 'harga_menu_view' },
        { text: 'Jumlah', value: 'jumlah_menu' }
      ],
      detailPesanEdit: [
        {
          text: 'Nama menu',
          align: 'start',
          sortable: true,
          value: 'nama_menu'
        },
        { text: 'Harga Menu', value: 'harga_menu_view' },
        { text: 'Jumlah', value: 'jumlah_menu' },
        { text: 'Actions', value: 'actions' }
      ],
      detailPesanTambah: [
        {
          text: 'Nama menu',
          align: 'start',
          sortable: true,
          value: 'nama_menu'
        },
        { text: 'Harga Menu', value: 'harga_menu_view' },
        { text: 'Actions', value: 'actions' }
      ],
      jumlahCounter: [],
      transaksi: [],
      transaksis: [],
      transaksiForm: new FormData(),
      transaksisComp: [],
      pesanan: [],
      pesanans: [],
      pesananForm: new FormData(),
      // pegawai: new FormData(),
      detailPesanan: new FormData(),
      tampungForm: [],
      pegawais: [],
      menus: [],
      menusTemp: [],
      form: {
        nama_pembeli: '',
        nama_pegawai: '',
        tanggal_transaksi: null,
        subtotal: 0,
        total_harga: 0,
        subtotal_view: 0,
        total_harga_view: 0,
        nama_menu: '',
        tax: 0,
        tax_view: 0,
        jumlah_menu: 0,
        harga_menu: null,
        harga_menu_view: null,
        foto_menu: null,
        deskripsi_menu: null,
        jenis_menu: null
      },
      deleteId: '',
      restoreId: '',
      editId: '',
      menuId: '',
      pesananId: '',
      transaksiId: '',
      detailPesananId: '',
      bayarId: '',
      formatter: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: '0'
      })
    }
  },
  methods: {
    // read data transaksi
    readData () {
      const url = this.$api + '/transaksi'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.transaksisComp = response.data.data
      })
    },
    // read data pesanan
    async readDataPesanan (Id) {
      const url = this.$api + '/pesanan/' + Id
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.pesanans = response.data.data
        console.log(this.pesanans)
        for (let i = 0; i < this.pesanans.length; i++) {
          this.form.subtotal += (this.pesanans[i].jumlah_menu * this.pesanans[i].harga_menu)
        }
        this.form.subtotal_view = this.formatter.format(this.form.subtotal)
        this.form.tax = this.form.subtotal / 10
        this.form.total_harga = this.form.tax + this.form.subtotal
        this.form.tax_view = this.formatter.format(this.form.tax)
        this.form.total_harga_view = this.formatter.format(this.form.total_harga)
      })
    },
    async readOneTransaksi (Id) {
      const url = this.$api + '/transaksi/' + Id
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.transaksis = response.data.data
      })
    },
    readDataMenu () {
      const url = this.$api + '/menuNotDeleted'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.menus = response.data.data
        this.menus.jumlah_menu = 0
        this.menusTemp = response.data.data
      })
    },
    countDataMenu () {
      const url = this.$api + '/countMenu'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.banyakMenu = response.data.data
        // this.makeVarCounter()
      })
    },
    readNamaPembeli (searchName) {
      const url = this.$api + '/pesananByName/' + searchName
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.transaksis = response.data.data
      })
    },
    searchMenu (name) {
      if (name === null || name === '') {
        this.readData()
      } else {
        this.readNamaPembeli(name)
      }
    },
    getToday () {
      const today = new Date()
      const tanggal = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const waktu = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()

      const tanggalwaktu = tanggal + '   ' + waktu
      return tanggalwaktu
    },
    getSisaMenu () {
      for (let i = 0; i < this.pesanans.length; i++) {
        for (let j = 0; j < this.menus.length; j++) {
          if (this.pesanans[i].nama_menu === this.menus[j].nama_menu) {
            this.menusTemp.splice(j, 1)
          }
        }
      }
    },
    searchInPesanans () {
      for (let i = 0; i < this.pesanans.length; i++) {
        if (this.form.nama_menu === this.pesanans[i].nama_menu) {
          this.pesanans[i].jumlah_menu = this.form.jumlah_menu
        }
      }
      console.log(this.pesanans)
      if (this.dialog === true && this.inputType === 'Ubah' && this.statusData === 'Hapus') {
        this.deleteOneDP()
      } else {
        this.setForm()
      }
    },
    setForm () {
      if (this.inputType === 'Tambah') {
        this.save()
      } else if (this.inputType === 'Ubah') {
        console.log(this.form.jumlah_menu, this.jumlahTemp)
        if (this.dialogEditTambah === true) {
          this.increaseDP()
        } else if (!(this.form.jumlah_menu === this.jumlahTemp)) {
          console.log(this.detailPesananId)
          this.editedDP = 'Kurang'
          this.updateDP()
        }
      } else if (this.inputType === 'Bayar') {
        this.bayar()
      }
    },
    reverseData () {
      if (this.statusData === 'Restore') {
        this.restoreData()
      } else if (this.statusData === 'Hapus' && this.inputType === 'Tambah') {
        this.deleteData()
        // this.deletePesanan()
      } else {
        this.deleteOneDP(this.detailPesananId)
      }
    },
    countTemp (value, item) {
      if (value === 'Tambah') {
        item.jumlah_menu -= -1
      } else if (value === 'Kurang' && item.jumlah_menu > 0) {
        item.jumlah_menu -= 1
      }
    },
    countSubTotal () {
      this.form.subtotal = 0
      for (let i = 0; i < this.pesanans.length; i++) {
        this.form.subtotal += (this.pesanans[i].jumlah_menu * this.pesanans[i].harga_menu)
      }
      if (this.inputType === 'Delete' || this.editedDP === 'Kurang') {
        this.form.subtotal -= this.form.jumlah_menu * this.form.harga_menu
      } else if (this.editedDP === 'Tambah') {
        this.form.subtotal += this.form.jumlah_menu * this.form.harga_menu
      }
      this.form.subtotal_view = this.formatter.format(this.form.subtotal)
      console.log(this.form.subtotal_view)
    },
    countTotalHarga () {
      this.form.total_harga = 0
      this.tax = (this.form.subtotal / 10)
      this.form.total_harga = this.tax + this.form.subtotal
      this.form.tax_view = this.formatter.format(this.form.tax)
      this.form.total_harga_view = this.formatter.format(this.form.total_harga)
    },
    loginName () {
      return sessionStorage.getItem('nama')
    },
    bayar () {
      const url = this.$api + '/transaksiDone/' + this.bayarId + '/' + sessionStorage.getItem('id')
      this.load = true
      this.$http.put(url, this.transaksi, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.cancel()
        this.readData()
        this.resetForm()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    async updateDP () {
      // this.tampungForm.push(this.form.jumlah_menu)
      // this.tampungForm.push(this.pesananId)
      // this.tampungForm.push(this.menuId)

      this.detailPesanan.set('jumlah_menu', JSON.stringify(this.form.jumlah_menu))
      this.detailPesanan.set('pesananId', JSON.stringify(this.pesananId))
      this.detailPesanan.set('menuId', JSON.stringify(this.menuId))
      console.log(this.detailPesanan)

      const url = this.$api + '/updateDetailPesanan'
      this.load = true
      this.$http.post(url, this.detailPesanan, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData()
        this.updatePesanan()
        this.updateTransaksi()
        this.dialogLoading = true
        this.inputType = 'Tambah'
      }).catch(error => {
        console.log(error)
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
      this.detailPesanan.delete('data')
    },
    async increaseDP () {
      this.tampungForm.push(this.form.jumlah_menu)
      this.tampungForm.push(this.pesananId)
      this.tampungForm.push(this.menuId)

      // this.detailPesanan.set('jumlah_menu', JSON.stringify(this.form.jumlah_menu))
      // this.detailPesanan.set('pesananId', JSON.stringify(this.pesananId))

      this.detailPesanan.set('data', JSON.stringify(this.tampungForm))
      console.log(this.detailPesanan)

      const url = this.$api + '/tambahDetailPesanan'
      this.load = true
      this.$http.post(url, this.detailPesanan, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.readDataPesanan(this.pesananId)
        this.close()
        this.readData()
        this.updatePesanan()
        this.updateTransaksi()
        this.inputType = 'Tambah'
        this.dialogLoading = true
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
      this.detailPesanan.delete('data')
    },
    async updatePesanan () {
      await this.Async()
      this.form.subtotal = 0
      for (let i = 0; i < this.pesanans.length; i++) {
        this.form.subtotal += (this.pesanans[i].jumlah_menu * this.pesanans[i].harga_menu)
      }
      this.pesanan.push(this.form.subtotal)
      this.pesanan.push(this.form.nama_pembeli)
      this.pesanan.push(this.form.tanggal_transaksi)

      this.pesananForm.append('data', JSON.stringify(this.pesanan))
      console.log(this.pesananForm)

      const url = this.$api + '/pesanan/' + this.pesananId
      this.load = true
      this.$http.post(url, this.pesananForm, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.cancel()
        this.readData()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
      this.pesananForm.delete('data')
    },
    async updateTransaksi () {
      await this.Async()
      this.form.total_harga = 0
      this.form.total_harga = (this.form.subtotal / 10) + this.form.subtotal
      this.transaksi.push(this.form.total_harga)
      this.transaksi.push(this.form.tanggal_transaksi)

      this.transaksiForm.append('data', JSON.stringify(this.transaksi))

      const url = this.$api + '/transaksi/' + this.transaksis[0].id_transaksi
      this.load = true
      this.$http.post(url, this.transaksiForm, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.cancel()
        this.readData()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
      this.transaksiForm.delete('data')
    },
    restoreData () {
      const url = this.$api + '/transaksi/restore/' + this.restoreId
      this.load = true
      this.$http.put(url, null, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.cancel()
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
    deleteData () {
      const url = this.$api + '/transaksi/softDelete/' + this.deleteId
      this.load = true
      this.$http.put(url, null, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.cancel()
        this.readData() // mengambil data
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    deletePesanan () {
      this.form.subtotal = 0
      for (let i = 0; i < this.pesanans.length; i++) {
        this.form.subtotal += (this.pesanans[i].jumlah_menu * this.pesanans[i].harga_menu)
      }
      this.pesanan.push(this.form.subtotal)
      this.pesanan.push(this.form.nama_pembeli)

      this.pesananForm.append('data', JSON.stringify(this.pesanan))

      const url = this.$api + '/pesanan/' + this.pesananId
      this.load = true
      this.$http.post(url, this.pesananForm, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.cancel()
        this.readData()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
      this.pesananForm.delete('data')
    },
    deleteOneDP (id) {
      const url = this.$api + '/detailPesanan/softDelete/' + id
      this.load = true
      this.$http.put(url, null, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.updateTransaksi()
        this.updatePesanan()
        this.dialogLoading = true
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    Async () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 5000)
      })
    },
    tambahDetailPesan () {
      this.getSisaMenu()
      this.dialogEditTambah = true
    },
    editDetailpesan (item, idMenu) {
      if (this.dialogEditTambah === true) {
        this.form.jumlah_menu = 0
        for (let i = 0; i < this.menus.length; i++) {
          if (item.nama_menu === this.menusTemp[i].nama_menu) {
            this.menuId = this.menusTemp[i].id
            break
          }
        }
      } else {
        this.form.jumlah_menu = item.jumlah_menu
        this.jumlahTemp = item.jumlah_menu
        this.editId = item.id
      }
      this.pesananId = this.transaksis[0].id_pesanan
      this.detailPesananId = this.transaksis[0].id_detailpesanan
      this.menuId = idMenu
      item.nama_pegawai = sessionStorage.getItem('nama')
      this.form.nama_menu = item.nama_menu
      this.form.harga_menu = item.harga_menu
      this.form.harga_menu_view = item.harga_menu_view
      this.form.deskripsi_menu = item.deskripsi_menu
      this.dialogTambah = true
    },
    deleteDetailpesan (item) {
      this.form.jumlah_menu = item.jumlah_menu
      this.form.harga_menu = item.harga_menu
      this.inputType = 'Delete'
      for (let i = 0; i < this.pesanans.length; i++) {
        if (this.pesanans[i].id === item.id && this.pesanans[i].id_menu === item.id_menu) {
          this.deleteHandler(item)
        }
      }
    },
    async editHandler (item) {
      this.inputType = 'Ubah'
      this.editId = item.id
      await this.readOneTransaksi(this.editId)
      item.nama_pegawai = sessionStorage.getItem('nama')
      this.BEHandler(item, this.editId)
    },
    bayarHandler (item) {
      this.inputType = 'Bayar'
      this.bayarId = item.id
      item.nama_pegawai = sessionStorage.getItem('nama')
      this.BEHandler(item, this.bayarId)
    },
    async BEHandler (item, Id) {
      await this.readDataPesanan(Id)
      this.jumlahCounter = item
      this.form.nama_pembeli = item.nama_pembeli
      this.form.nama_pegawai = item.nama_pegawai
      this.form.tanggal_transaksi = item.tanggal_transaksi
      this.form.nama_menu = item.nama_menu
      this.form.jumlah_menu = item.jumlah_menu
      this.form.harga_menu = item.harga_menu
      this.form.harga_menu_view = item.harga_menu_view
      this.form.foto_menu = item.foto_menu
      this.form.deskripsi_menu = item.deskripsi_menu
      this.form.jenis_menu = item.jenis_menu
      this.dialog = true
    },
    deleteHandler (item) {
      this.deleteId = item.id_transaksi
      this.pesananId = item.id_pesanan
      this.detailPesananId = item.id
      this.dialogConfirm = true
      this.statusData = 'Hapus'
      this.countSubTotal()
      this.countTotalHarga()
    },
    restoreHandler (item) {
      this.restoreId = item.id_transaksi
      this.dialogConfirm = true
      this.statusData = 'Restore'
    },
    close () {
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.dialogEditTambah = false
      this.dialogLoading = false
      this.inputType = 'Tambah'
      this.statusData = ''
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.dialogEditTambah = false
      this.dialogLoading = false
      this.pesananId = ''
      this.menuId = ''
      this.detailPesananId = ''
      this.bayarId = ''
      this.editId = ''
      this.inputType = 'Tambah'
    },
    resetForm () {
      this.form = {
        nama_menu: null,
        nama_pembeli: null,
        jumlah_menu: 0,
        tax: 0,
        subtotal: 0,
        total_harga: 0,
        tax_view: 0,
        subtotal_view: 0,
        total_harga_view: 0,
        nama_pegawai: null,
        tanggal_transaksi: null,
        harga_menu: null,
        harga_menu_view: null,
        foto_menu: null,
        deskripsi_menu: null,
        jenis_menu: null
      }
      this.pesanans = []
      this.transaksis = []
      this.pesanan = []
      this.transaksi = []
      this.editedDP = 'Tambah'
      this.statusData = ''
      this.detailPesanan.delete('data')
      this.transaksiForm.delete('data')
      this.pesananForm.delete('data')
    },
    replaceUrl () {
      this.$router.replace('/')
    }
  },
  computed: {
    formTitle () {
      return this.inputType
    }
  },
  mounted () {
    this.readData()
    this.countDataMenu()
    this.readDataMenu()
  },
  watch: {
    pesanans: {
      deep: true,
      handler: function (after) {
        // for (let i = 0; i < after.length; i++) {
        //   const item = after[i]
        //   item.jumlah_menu = this.form.jumlah_menu
        // }
      }
    }
  }
}
</script>

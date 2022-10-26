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
                @keydown.enter="readNamaPembeli(search)"
            ></v-text-field>
            <v-spacer></v-spacer>
              <v-btn color="success" dark @click="tambahHandler()">
                  Tambah
              </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="transaksis" :search="search" >
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="bayarHandler(item)">
                        mdi-cash
                    </v-icon>
                    <v-icon small class="mr-2" @click="editHandler(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon v-if="item.is_Deleted === 0" small class="mr-2" @click="deleteHandler(item.id)">
                        mdi-delete
                    </v-icon>
                    <v-icon v-else-if="item.is_Deleted === 1" small class="mr-2" @click="restoreHandler(item.id)">
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
                <v-card-text>
                    <v-container>
                        <v-text-field
                          v-model="form.nama_pembeli"
                          label="Nama Pembeli"
                          required>
                        </v-text-field>
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

                        <v-data-table
                          v-if="inputType === 'Tambah'"
                          :headers="detailpesan"
                          :items="menus">
                            <template v-slot:[`item.Jumlah`]>
                              <v-row dense>
                                <v-col
                                  class="mt-4"
                                  cols="4"
                                  sm="2"
                                  md="1"
                                  >
                                  <v-icon small class="mr-2" @click="countTemp('Tambah', menus)">
                                    mdi-plus
                                  </v-icon>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="3"
                                  >
                                  <v-card-text
                                    class="text-align-center ml-1"
                                    >
                                    {{menus.jumlah_menu}}
                                  </v-card-text>
                                </v-col>
                                <v-col
                                  class="mt-4"
                                  cols="4"
                                  sm="2"
                                  md="1"
                                  >
                                  <v-icon v-if="form.jumlah_menu === 0" small class="ml-2" disable>
                                    mdi-minus
                                  </v-icon>
                                  <v-icon v-else-if="form.jumlah_menu > 0" small class="ml-2" @click="countTemp('Kurang', menus)">
                                    mdi-minus
                                  </v-icon>
                                </v-col>
                              </v-row>
                            </template>
                        </v-data-table>

                        <v-data-table
                          v-else-if="inputType === 'Ubah' || inputType === 'Bayar'"
                          :headers="detailpesan"
                          :items="pesanans">
                            <template v-slot:[`item.Jumlah`]>
                              <v-row dense>
                                <v-col
                                  class="mt-4"
                                  cols="4"
                                  sm="2"
                                  md="1"
                                  >
                                  <v-icon v-if="inputType === 'Ubah'" small class="mr-2" @click="countTemp('Tambah', menus)">
                                    mdi-plus
                                  </v-icon>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="3"
                                  >
                                  <v-card-text
                                    class="text-align-center ml-1"
                                    >
                                    {{form.jumlah_menu}}
                                  </v-card-text>
                                </v-col>
                                <v-col
                                  class="mt-4"
                                  cols="4"
                                  sm="2"
                                  md="1"
                                  >
                                  <v-icon v-if="form.jumlah_menu === 0 && inputType === 'Ubah'" disable small class="ml-2">
                                    mdi-minus
                                  </v-icon>
                                  <v-icon v-else-if="form.jumlah_menu > 0 && inputType === 'Ubah'" small class="ml-2" @click="countTemp('Kurang', menus)">
                                    mdi-minus
                                  </v-icon>
                                </v-col>
                              </v-row>
                            </template>
                        </v-data-table>

                        <v-text-field
                          v-model="form.nama_pegawai"
                          label="Nama Pegawai">
                        </v-text-field>

                    </v-container>
                </v-card-text>
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
                  <v-btn color="blue darken-1" text @click="cancel">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="reverseData">
                    Yes
                  </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
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
      headers: [
        {
          text: 'Nama Pembeli',
          align: 'start',
          sortable: true,
          value: 'nama_pembeli'
        },
        { text: 'Tanggal Transaksi', value: 'tanggal_transaksi' },
        { text: 'Total Harga', value: 'total_harga' },
        { text: 'Actions', value: 'actions' }
      ],
      detailpesan: [
        {
          text: 'Nama menu',
          align: 'start',
          sortable: true,
          value: 'nama_menu'
        },
        { text: 'Harga Menu', value: 'harga_menu' },
        { text: 'Jumlah', value: 'Jumlah' }
      ],
      jumlahCounter: [],
      transaksi: new FormData(),
      transaksis: [],
      // pesanan: new FormData(),
      pesanans: [],
      // pegawai: new FormData(),
      pegawais: [],
      menus: [],
      form: {
        nama_pembeli: '',
        nama_pegawai: '',
        tanggal_transaksi: null,
        subtotal: 0,
        total_harga: 0,
        nama_menu: '',
        tax: 0,
        jumlah_menu: 0
      },
      deleteId: '',
      restoreId: '',
      editId: '',
      bayarId: ''
    }
  },
  methods: {
    // read data transaksi
    readData () {
      const url = this.$api + '/transaksi'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.transaksis = response.data.data
      })
    },
    // read data pesanan
    readDataPesanan () {
      const url = this.$api + '/pesanan'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.pesanans = response.data.data
      })
    },
    readDataMenu () {
      const url = this.$api + '/menuNotDeleted'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.menus = response.data.data
        this.menus.jumlah_menu = 0
      })
    },
    countDataMenu () {
      const url = this.$api + '/countMenu'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.banyakMenu = response.data.data
        this.pushCounter()
        // this.makeVarCounter()
      })
    },
    // read data customer
    // readDataCustomer () {
    //   const url = this.$api + '/customer'
    //   this.$http.get(url, {
    //     headers: {
    //       Authorization: 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.customers = response.data.data
    //   })
    // },
    readNamaPembeli (searchName) {
      const url = this.$api + '/pesananByName/' + searchName
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.transaksis = response.data.data
      })
    },
    // get tanggal hari ini
    getToday () {
      const today = new Date()
      const tanggal = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const waktu = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()

      const tanggalwaktu = tanggal + '   ' + waktu
      return tanggalwaktu
    },
    // makeVarCounter () {
    //   for (let i = 0; i < this.banyakMenu; i++) {
    //     this.jumlahCounter[i] = 0
    //   }
    //   for (let k = 0; k < this.banyakMenu; k++) {
    //     const jumlahTemp = 0
    //     this.menus[k].push(jumlahTemp)
    //   }
    //   console.log(this.menus)
    // },
    pushCounter () {
      for (let i = 0; i < this.banyakMenu; i++) {
        this.menus[i].push(this.jumlahTemp)
      }
      console.log(this.menus)
    },
    setForm () {
      if (this.inputType === 'Tambah') {
        this.save()
      } else if (this.inputType === 'Ubah') {
        this.update()
      } else if (this.inputType === 'Bayar') {
        this.bayar()
      }
    },
    reverseData () {
      if (this.statusData === 'Restore') {
        this.restoreData()
      } else {
        this.deleteData()
      }
    },
    countTemp (value, item) {
      if (value === 'Tambah') {
        item.jumlah_menu = item.jumlah_menu + 1
      } else if (value === 'Kurang' && item.jumlah_menu > 0) {
        item.jumlah_menu = item.jumlah_menu - 1
      }
    },
    countSubTotal () {
      this.form.subtotal = this.transaksi.jumlah_menu * this.transaksi.harga_menu
    },
    countTax () {
      this.form.tax = this.transaksi.subtotal / 10
    },
    countTotalHarga () {
      this.form.total_harga = this.transaksi.tax + this.transaksi.subtotal
    },
    loginName () {
      return localStorage.getItem('nama')
    },
    // simpan data transaksi
    save () {
      this.transaksi.append('tanggal_transaksi', this.form.tanggal_transaksi)

      const url = this.$api + '/transaksi'
      this.load = true
      this.$http.post(url, this.transaksi, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.resetForm()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    // ubah data transaksi
    update () {
      const newData = {
        nama_pembeli: this.form.nama_pembeli,
        jumlah_menu: this.form.jumlah_menu,
        subtotal: this.countSubTotal(),
        nama_menu: this.form.nama_menu
      }
      const url = this.$api + '/transaksi/' + this.editId
      this.load = true
      this.$http.put(url, newData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then().then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    // soft delete data transaksi
    deleteData () {
      const url = this.$api + '/transaksi/softDelete/' + this.deleteId
      this.load = true
      this.$http.put(url, null, {
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
    tambahHandler () {
      this.dialog = true
      this.readDataMenu()
    },
    editHandler (item) {
      this.inputType = 'Ubah'
      this.editId = item.id
      item.nama_pegawai = localStorage.getItem('nama')
      this.BEHandler(item)
    },
    bayarHandler (item) {
      this.inputType = 'Bayar'
      this.bayarId = item.id
      item.nama_pegawai = localStorage.getItem('nama')
      this.BEHandler(item)
    },
    BEHandler (item) {
      this.form.nama_pembeli = item.nama_pembeli
      this.form.nama_pegawai = item.nama_pegawai
      this.form.tanggal_transaksi = item.tanggal_transaksi
      this.form.total_harga = item.total_harga
      this.form.nama_menu = item.nama_menu
      this.form.jumlah_menu = item.jumlah_menu
      this.dialog = true
      this.readDataPesanan()
    },
    deleteHandler (id) {
      this.deleteId = id
      this.dialogConfirm = true
      this.statusData = 'Hapus'
    },
    restoreHandler (id) {
      this.restoreId = id
      this.dialogConfirm = true
      this.statusData = 'Restore'
    },
    close () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.inputType = 'Tambah'
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogTambah = false
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
        nama_pegawai: null,
        tanggal_transaksi: null
      }
      this.pesanans = []
    },
    countMenu () {

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
    // this.readDataPegawai()
  }
}
</script>

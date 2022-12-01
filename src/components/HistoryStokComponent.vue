<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> History Stok </h3>

        <v-card>
            <v-card-title>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="success" dark @click="dialog = true">
                Tambah
            </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="stoks" :search="search">
              <template v-slot:[`item.status_stok`]="{ item }">
                <p v-if="item.status_stok === 1">
                  Masuk
                </p>
                <p v-else-if="item.status_stok === 0">
                  Keluar
                </p>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
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
                    <span class="headline">{{inputType}} stok</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.nama_stok"
                            label="Nama"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.jumlah_stok"
                            label="Jumlah Masuk Stok"
                            required
                        ></v-text-field>
                        <v-select
                            v-model="form.satuan_stok"
                            :items="satuanStok"
                            :rules="[(v) => !!v || 'Satuan tidak boleh kosong']"
                            label="Satuan Stok"
                            required
                        ></v-select>
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
                              v-model="form.tanggal_stok"
                              label="Tanggal Masuk"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                              v-model="form.tanggal_stok"
                              @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                        <v-text-field
                            v-model="form.harga_stok"
                            label="Harga Stok"
                            required
                        ></v-text-field>
                        <v-select
                            v-model="form.status_stok"
                            :items="statusStok"
                            :rules="[(v) => !!v || 'Status tidak boleh kosong']"
                            label="Status Stok"
                            required
                        ></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
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
                    Anda yakin ingin menghapus stok?
                </v-card-text>
                <v-card-text v-else-if="statusData === 'Restore'">
                    Anda yakin ingin memulihkan stok?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
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
  name: 'historyStok-component',
  data () {
    return {
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      search: null,
      statusData: '',
      dialog: false,
      menu2: false,
      dialogConfirm: false,
      headers: [
        { text: 'Nama stok', value: 'nama_stok' },
        { text: 'Jumlah Stok', value: 'jumlah_stok' },
        { text: 'Satuan', value: 'satuan_stok' },
        {
          text: 'Tanggal Stok (YYYY-MM-DD)',
          align: 'start',
          sortable: true,
          value: 'tanggal_stok'
        },
        { text: 'Harga Stok', value: 'harga_stok' },
        { text: 'Status Stok', value: 'status_stok' },
        { text: 'Actions', value: 'actions' }
      ],
      satuanStok: [
        'gram',
        'mL',
        'Buah'
      ],
      statusStok: [
        'Masuk',
        'Keluar'
      ],
      historyStok: new FormData(),
      stoks: [],
      form: {
        nama_stok: '',
        jumlah_stok: '',
        satuan_stok: '',
        tanggal_stok: '',
        harga_stok: '',
        status_stok: ''
      },
      deleteId: '',
      restoreId: '',
      editId: ''
    }
  },
  methods: {
    // read data stok
    readData () {
      const url = this.$api + '/historystok'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.stoks = response.data.data
      })
    },
    // read deleted
    readDeleted () {
      const url = this.$api + '/historystok/deleted'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.stoks = response.data.data
      })
    },
    setForm () {
      if (this.inputType === 'Tambah') {
        this.save()
      } else {
        this.update()
      }
    },
    reverseData () {
      if (this.statusData === 'Restore') {
        this.restoreData()
      } else {
        this.deleteData()
      }
    },
    checkStatus () {
      if (this.form.status_stok === 'Masuk') {
        this.form.status_stok = 1
      } else if (this.form.status_stok === 'Keluar') {
        this.form.status_stok = 0
      }
    },
    // simpan data produk
    save () {
      this.checkStatus()
      this.historyStok.append('nama_stok', this.form.nama_stok)
      this.historyStok.append('jumlah_stok', this.form.jumlah_stok)
      this.historyStok.append('satuan_stok', this.form.satuan_stok)
      this.historyStok.append('tanggal_stok', this.form.tanggal_stok)
      this.historyStok.append('harga_stok', this.form.harga_stok)
      this.historyStok.append('status_stok', this.form.status_stok)

      const url = this.$api + '/historystok'
      this.load = true
      this.$http.post(url, this.historyStok, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
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
        nama_stok: this.form.nama_stok,
        jumlah_stok: this.form.jumlah_stok,
        satuan_stok: this.form.satuan_stok,
        tanggal_stok: this.form.tanggal_stok,
        harga_stok: this.form.harga_stok,
        status_stok: this.form.status_stok
      }
      const url = this.$api + '/historystok/' + this.editId
      this.load = true
      this.$http.put(url, newData, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
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
    // soft delete data produk
    deleteData () {
      const url = this.$api + '/historystok/softDelete/' + this.deleteId
      this.load = true
      this.$http.put(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
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
      const url = this.$api + '/historystok/restore/' + this.deletedId
      this.$http.put(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
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
    editHandler (item) {
      this.inputType = 'Edit'
      this.editId = item.id
      this.form.nama_stok = item.nama_stok
      this.form.jumlah_stok = item.jumlah_stok
      this.form.satuan_stok = item.satuan_stok
      this.form.tanggal_stok = item.tanggal_stok
      this.form.harga_stok = item.harga_stok
      this.form.status_stok = item.status_stok
      this.dialog = true
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
        nama_stok: '',
        jumlah_stok: null,
        satuan_stok: '',
        tanggal_stok: '',
        harga_stok: null,
        status_stok: null
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

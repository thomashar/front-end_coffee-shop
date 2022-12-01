<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Resep </h3>

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
            <v-btn color="success" dark @click="dialogTambah = true">
                Tambah
            </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="reseps" :search="search">
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

        <v-dialog v-model="dialogTambah" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Tambah resep</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.nama_resep"
                            label="Nama"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.jumlah_resep"
                            label="Jumlah Resep"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.nama_menu"
                            label="Nama Menu"
                            required
                        ></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogTambah = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Ubah resep</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.nama_resep"
                            label="Nama"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.jumlah_resep"
                            label="Jumlah Resep"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.nama_menu"
                            label="Nama Menu"
                            required
                        ></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="update">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">warning!</span>
                </v-card-title>
                <v-card-text>
                    Anda yakin ingin menghapus resep?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData">
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
  name: 'resep-component',
  data () {
    return {
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogTambah: false,
      headers: [
        { text: 'Nama Resep', value: 'nama_resep' },
        { text: 'Jumlah Resep', value: 'jumlah_resep' },
        {
          text: 'Menu',
          align: 'start',
          sortable: true,
          value: 'nama_menu'
        },
        { text: 'Actions', value: 'actions' }
      ],
      resep: new FormData(),
      reseps: [],
      form: {
        nama_resep: '',
        jumlah_resep: '',
        id_menu: '',
        nama_menu: ''
      },
      deleteId: '',
      editId: ''
    }
  },
  methods: {
    // read data stok
    readData () {
      const url = this.$api + '/resep'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.reseps = response.data.data
      })
    },
    // simpan data produk
    save () {
      this.resep.append('nama_resep', this.form.nama_resep)
      this.resep.append('jumlah_resep', this.form.jumlah_resep)
      this.resep.append('id_menu', this.form.id_menu)

      const url = this.$api + '/resep'
      this.load = true
      this.$http.post(url, this.resep, {
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
        nama_resep: this.form.nama_resep,
        jumlah_resep: this.form.jumlah_resep,
        id_menu: this.form.id_menu
      }
      const url = this.$api + '/resep/' + this.editId
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
      const url = this.$api + '/resep/softDelete/' + this.deleteId
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
      const url = this.$api + '/resep/restore/' + this.deletedId
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
      this.inputType = 'Ubah'
      this.editId = item.id
      this.form.nama_resep = item.nama_resep
      this.form.jumlah_resep = item.jumlah_resep
      this.form.id_menu = item.id_menu
      this.dialog = true
    },
    deleteHandler (id) {
      this.deleteId = id
      this.dialogConfirm = true
    },
    close () {
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
        nama_resep: '',
        jumlah_resep: null,
        id_menu: '',
        nama_menu: ''
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

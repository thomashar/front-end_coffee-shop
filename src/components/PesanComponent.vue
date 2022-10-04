<template class="justify-center px-10">
    <v-main class="list justify-center">
        <div class="d-flex justify-space-between ma-4">
          <div style="width:10%"></div>
          <h2 class="text-center">
            SIKafe
          </h2>
          <v-icon class="d-flex">
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
          <v-card class="text-xs ma-4 cards pa-2"
                  :style="{
                      background: '#ffffff'
                  }">
            <v-img
              :src='showPic(item)'
            />
            <v-list-item-content class="pa-2">
              <v-list-item-title> <b>{{ item.nama_menu }} &dash; Rp.{{ item.harga_menu }}</b></v-list-item-title>
                <v-list-item-subtitle >{{ item.deskripsi_menu }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-card>
        </v-flex>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
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
      color: '',
      showed: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogTambah: false,
      dialogUpload: false,
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
      jenisMenu: [
        'Kopi',
        'Non-Kopi',
        'Makanan'
      ],
      menu: new FormData(),
      menus: [],
      form: {
        nama_menu: null,
        harga_menu: null,
        foto_menu: null,
        deskripsi_menu: null,
        jenis_menu: null
      },
      deleteId: '',
      editId: '',
      uploadId: '',
      uploadNama_menu: '',
      foto_menu: []
    }
  },
  methods: {
    // read data menu
    readData () {
      const url = this.$api + '/customer'
      this.$http.get(url, {
      }).then(response => {
        this.menus = response.data.data
        console.log(this.menus)
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
        return menu.foto_menu
      } else {
        return this.$urlFoto + '/menu_picture/image-remove.png'
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

    imageChanged (e) {
      console.log(e.target.files[0])
      const fileReader = new FileReader()
      fileReader.readAsDataURL(e.target.files[0])

      fileReader.onload = (e) => {
        this.foto_menu = e.target.result
      }
    },

    uploadImg () {
      const newData = {
        foto_menu: this.foto_menu
      }
      const url = this.$api + '/menu/upimg/' + this.uploadId
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
    // soft delete data produk
    deleteData () {
      const url = this.$api + '/menu/softDelete/' + this.deleteId
      this.load = true
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
    uploadHandler (id, item) {
      this.uploadId = id
      this.uploadNama_menu = item.nama_menu
      this.dialogUpload = true
    },
    editHandler (item) {
      this.inputType = 'Ubah'
      this.editId = item.id
      this.form.nama_menu = item.nama_menu
      this.form.harga_menu = item.harga_menu
      this.form.foto_menu = item.foto_menu
      this.form.deskripsi_menu = item.deskripsi_menu
      this.form.jenis_menu = item.jenis_menu
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
      this.dialogUpload = false
      this.inputType = 'Tambah'
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogUpload = false
      this.dialogTambah = false
      this.inputType = 'Tambah'
    },
    resetForm () {
      this.form = {
        nama_menu: null,
        harga_menu: null,
        foto_menu: [],
        deskripsi_menu: null,
        unit_menu: null,
        jenis_menu: null
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

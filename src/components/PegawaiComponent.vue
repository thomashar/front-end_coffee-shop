<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Pegawai </h3>

        <h5 class="pa-4 ma-4"> Pegawai mendaftar : </h5>
        <v-row>
          <v-col v-for="calon in pegawaiMendaftars" :key="calon.id">
            <v-card class="text-xs ma-4 cards pa-2" @click="acceptHandler(calon)"
                  :style="{
                      background: '#ffffff',
                      maxWidth: '384px'
                  }">
              <v-card-title>{{calon.nama_pegawai}}</v-card-title>
              <v-card-subtitle>
                {{calon.jenis_kelamin}}<br/>
                {{calon.hp_pegawai}}<br/>
                {{calon.email_pegawai}}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <v-card>
            <v-card-title>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                @keydown.enter="readNamaPegawai(search)"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="success" dark @click="dialog = true">
                Tambah
            </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="pegawais" :search="search">
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
                    <span class="headline">{{ formTitle }} Pegawai</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.nama_pegawai"
                            label="Nama Pegawai"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="form.jenis_kelamin"
                            :items="kelamins"
                            label="Jenis kelamin"
                            required
                        ></v-select>

                        <v-text-field
                            v-model="form.hp_pegawai"
                            label="HP"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.alamat_pegawai"
                            label="Alamat"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.email_pegawai"
                            label="Email"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="form.jabatan_pegawai"
                            :items="jabatans"
                            :rules="[(v) => !!v || 'Jabatan tidak boleh kosong']"
                            label="Jabatan"
                            required
                        ></v-select>

                        <v-text-field
                            v-model="form.password"
                            label="Password"
                            required
                        ></v-text-field>
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

        <v-dialog v-model="dialogAccept" persistent max-width="600px">
          <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Pegawai</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.nama_pegawai"
                            label="Nama Pegawai"
                            readonly
                        ></v-text-field>

                        <v-select
                            v-model="form.jenis_kelamin"
                            :items="kelamins"
                            label="Jenis kelamin"
                            readonly
                        ></v-select>

                        <v-text-field
                            v-model="form.hp_pegawai"
                            label="HP"
                            readonly
                        ></v-text-field>

                        <v-text-field
                            v-model="form.alamat_pegawai"
                            label="Alamat"
                            readonly
                        ></v-text-field>

                        <v-text-field
                            v-model="form.email_pegawai"
                            label="Email"
                            readonly
                        ></v-text-field>

                        <v-select
                            v-model="form.jabatan_pegawai"
                            :items="jabatans"
                            :rules="[(v) => !!v || 'Jabatan tidak boleh kosong']"
                            label="Jabatan"
                            required
                        ></v-select>
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

        <!-- <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Pegawai</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.nama_pegawai"
                            label="Nama Pegawai"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="form.jenis_kelamin"
                            :items="kelamins"
                            label="Jenis kelamin"
                            required
                        ></v-select>

                        <v-text-field
                            v-model="form.hp_pegawai"
                            label="HP"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.alamat_pegawai"
                            label="Alamat"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.email_pegawai"
                            label="Email"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="form.jabatan_pegawai"
                            :items="jabatans"
                            :rules="[(v) => !!v || 'Jabatan tidak boleh kosong']"
                            label="Jabatan"
                            required
                        ></v-select>
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
        </v-dialog> -->

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                  <span class="headline">Warning!!!</span>
                </v-card-title>
                <v-card-text v-if="statusData === 'Hapus'">
                    Anda yakin ingin menghapus data pegawai?
                </v-card-text>
                <v-card-text v-else-if="statusData === 'Restore'">
                    Anda yakin ingin memulihkan data pegawai?
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialogConfirm = false">
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
  name: 'pegawai-component',
  data () {
    return {
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      statusData: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogTambah: false,
      dialogAccept: false,
      headers: [
        {
          text: 'Nama Pegawai',
          align: 'start',
          sortable: true,
          value: 'nama_pegawai'
        },
        { text: 'Jenis Kelamin', value: 'jenis_kelamin' },
        { text: 'Telepon', value: 'hp_pegawai' },
        { text: 'Alamat', value: 'alamat_pegawai' },
        { text: 'Email', value: 'email_pegawai' },
        { text: 'Jabatan', value: 'jabatan_pegawai' },
        { text: 'Actions', value: 'actions' }
      ],
      jabatans: [
        'Pemilik',
        'Admin',
        'Kasir',
        'Pegawai'
      ],
      kelamins: [
        'Laki-laki',
        'Perempuan'
      ],
      pegawai: new FormData(),
      pegawais: [],
      pegawaiMendaftars: [],
      form: {
        nama_pegawai: '',
        jenis_kelamin: '',
        hp_pegawai: null,
        alamat_pegawai: '',
        email_pegawai: '',
        jabatan_pegawai: '',
        password: ''
      },
      deleteId: '',
      editId: ''
    }
  },
  methods: {
    setForm () {
      if (this.inputType === 'Tambah') {
        this.dialogTambah = true
        this.save()
      } else if (this.inputType === 'Ubah' || this.inputType === 'Accept') {
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
    // read data pegawai
    readData () {
      const url = this.$api + '/pegawai'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.pegawais = response.data.data
      })
    },
    // read data pegawai
    readPegawaiMendaftar () {
      const url = this.$api + '/pegawaiMendaftar'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.pegawaiMendaftars = response.data.data
      })
    },
    // read data pegawai
    readNamaPegawai (searchName) {
      const url = this.$api + '/pegawaiByName/' + searchName
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.pegawais = response.data.data
      })
    },
    // simpan data produk
    save () {
      this.pegawai.append('nama_pegawai', this.form.nama_pegawai)
      this.pegawai.append('jenis_kelamin', this.form.jenis_kelamin)
      this.pegawai.append('hp_pegawai', this.form.hp_pegawai)
      this.pegawai.append('jabatan_pegawai', this.form.jabatan_pegawai)
      this.pegawai.append('alamat_pegawai', this.form.alamat_pegawai)
      this.pegawai.append('email_pegawai', this.form.email_pegawai)
      this.pegawai.append('password', this.form.password)

      const url = this.$api + '/pegawai'
      this.load = true
      this.$http.post(url, this.pegawai, {
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
        nama_pegawai: this.form.nama_pegawai,
        jenis_kelamin: this.form.jenis_kelamin,
        hp_pegawai: this.form.hp_pegawai,
        jabatan_pegawai: this.form.jabatan_pegawai,
        alamat_pegawai: this.form.alamat_pegawai,
        email_pegawai: this.form.email_pegawai
      }
      const url = this.$api + '/pegawai/selfNoPass/' + this.editId
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
      const url = this.$api + '/pegawai/softDelete/' + this.deleteId
      this.load = true
      this.$http.get(url, {
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
    ETAHandler (item) {
      this.editId = item.id
      this.form.nama_pegawai = item.nama_pegawai
      this.form.jenis_kelamin = item.jenis_kelamin
      this.form.hp_pegawai = item.hp_pegawai
      this.form.jabatan_pegawai = item.jabatan_pegawai
      this.form.alamat_pegawai = item.alamat_pegawai
      this.form.email_pegawai = item.email_pegawai
    },
    editHandler (item) {
      this.inputType = 'Ubah'
      this.dialog = true
      this.ETAHandler(item)
    },
    acceptHandler  (item) {
      this.inputType = 'Accept'
      this.dialogAccept = true
      this.ETAHandler(item)
    },
    deleteHandler (id) {
      this.statusData = 'Hapus'
      this.deleteId = id
      this.dialogConfirm = true
    },
    restoreHandler (id) {
      this.statusData = 'Restore'
      this.deleteId = id
      this.dialogConfirm = true
    },
    close () {
      this.dialog = false
      this.dialogAccept = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.inputType = 'Tambah'
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogAccept = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.inputType = 'Tambah'
    },
    resetForm () {
      this.form = {
        nama_pegawai: null,
        jenis_kelamin: null,
        hp_pegawai: null,
        alamat_pegawai: null,
        email_pegawai: null,
        // password: null,
        jabatan_pegawai: null
      }
    }
  },
  computed: {
    formTitle () {
      return this.inputType
    }
  },
  mounted () {
    this.readData()
    this.readPegawaiMendaftar()
  }
}
</script>

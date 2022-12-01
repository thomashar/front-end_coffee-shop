<template>
    <v-main>
        <h3 class="text-h3 font-weight-medium mb-8"> Laporan </h3>
        <v-card>
            <v-row>
                <v-col>
                    <v-card class="ma-4 pa-4">
                        <h3 class="font-weight-medium mb-5"> Laporan Bulanan </h3>
                        <v-select v-model="month"
                                :items="selectMonth"
                                item-text="name"
                                item-value="value"
                                label="-- Pilih Bulan --"
                                persistent-hint
                                single-line solo dense outlined
                                required></v-select>
                        <v-btn class="d-flex justify-center align-center" @click="printReport()">
                            Unduh Laporan Bulanan
                        </v-btn>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="ma-4 pa-4">
                        <h3 class="font-weight-medium mb-5"> Laporan Tahunan </h3>
                        <v-select v-model="year"
                                :items="selectYear"
                                item-text="name"
                                item-value="value"
                                label="-- Pilih Tahun --"
                                persistent-hint
                                single-line solo dense outlined
                                required></v-select>
                        <v-btn class="d-flex justify-center align-center" @click="printReportYear()">
                            Unduh Laporan Tahunan
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-main>
</template>

<script>
export default {
  name: 'laporan-component',
  data () {
    return {
      month: null,
      year: null,
      selectMonth: [
        { name: 'Januari', value: '1' },
        { name: 'Februari', value: '2' },
        { name: 'Maret', value: '3' },
        { name: 'April', value: '4' },
        { name: 'Mei', value: '5' },
        { name: 'Juni', value: '6' },
        { name: 'Juli', value: '7' },
        { name: 'Agustus', value: '8' },
        { name: 'September', value: '9' },
        { name: 'Oktober', value: '10' },
        { name: 'November', value: '11' },
        { name: 'Desember', value: '12' }
      ],
      selectYear: [
        { name: '2016', value: '2016' },
        { name: '2017', value: '2017' },
        { name: '2018', value: '2018' },
        { name: '2019', value: '2019' },
        { name: '2020', value: '2020' },
        { name: '2021', value: '2021' },
        { name: '2022', value: '2022' }
      ]
    }
  },
  methods: {
    printReport () {
      const url = this.$api + '/penjualanMenuBulan/' + this.month
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
        responseType: 'blob'
      }).then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'LaporanPendapatanBulanan_' + this.month + '.pdf'
        link.click()
      })
    },
    printReportYear () {
      const url = this.$api + '/penjualanMenuTahun/' + this.year
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
        responseType: 'blob'
      }).then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'LaporanPendapatanTahunan_' + this.year + '.pdf'
        link.click()
      })
    }
  }
}
</script>

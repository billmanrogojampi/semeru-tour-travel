(async () => {
  try {
    const url = 'http://localhost:3000/api/jadwal';
    const getRes = await fetch(url);
    console.log('GET status', getRes.status);
    const data = await getRes.json();
    if (!data.success || !data.data || data.data.length === 0) {
      console.error('No data from GET');
      process.exit(1);
    }
    const first = data.data[0];
    const month = first.month;
    const year = first.year;
    const tanggal = first.dates[0].tanggal;
    const status = first.dates[0].status;
    console.log('Sample:', month, year, tanggal, status);

    const newStatus = status === 'Terbooking' ? 'Belum ada order' : 'Terbooking';
    const body = {
      month,
      year,
      tanggal,
      status: newStatus,
      keterangan: newStatus === 'Terbooking' ? 'Terbooking' : ''
    };

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    console.log('PUT status', putRes.status);
    console.log(await putRes.text());
  } catch (err) {
    console.error('Error', err);
    process.exit(1);
  }
})();

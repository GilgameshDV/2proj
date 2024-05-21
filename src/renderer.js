window.electron.onSystemInfo((data) => {
    document.getElementById('platform').innerText = data.platform;
    document.getElementById('gpu').innerText = data.gpuModel;
    document.getElementById('cpu-model').innerText = data.cpuModel;
    document.getElementById('cpu').innerText = `${data.cpuUsage} %`;
    document.getElementById('mem').innerText = `${data.memUsage} %`;
    document.getElementById('total-mem').innerText = `${data.totalMem} GB`;
  });
  
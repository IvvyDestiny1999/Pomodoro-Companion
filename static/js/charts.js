const ctx = document.getElementById("statsChart");
new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [{
      label: "Pomodoros concluídos",
      data: [3, 2, 4, 5, 1, 0, 2],
    }]
  }
});

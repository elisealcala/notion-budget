export function getCurrentYearAndMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const month = monthNames[now.getMonth()];

  return { year, month };
}

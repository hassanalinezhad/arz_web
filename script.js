// از https://www.navasan.tech/webserviceguide/#http-request استفاده شده است
document.addEventListener("DOMContentLoaded", () => {
  //کلید API رایگان
  const apiKey = "freeIEnSL0pvAM6S8ZuWTcmOmf6t6Smh";
  //آدرس API
  const apiUrl = `https://api.navasan.tech/latest/?api_key=${apiKey}`;
  const ratesDiv = document.getElementById("rates");

  //درخواست به سرور برای دریافت نرخ ارز
  fetch(apiUrl)
    //دریافت پاسخ و تبدیل آن به JSON
    .then((response) => response.json())
    .then((data) => {
      //نرخ های مرتبط با ارزهای مورد نظر
      const relevantRates = {
        //نرخ آمریکا
        usd: data.usd_sell,
        //نرخ کانادا
        cad: data.cad,
        //نرخ استرالیا
        aud: data.aud,
        //نرخ امارات متحده عربی
        aed: data.aed_sell,
        //نرخ ترکیه
        try: data.try,
        //نرخ چین
        cny: data.cny,
        //نرخ ژاپن
        jpy: data.jpy,
        //نرخ کره جنوبی
        krw: data.krw,
        //نرخ هند
        inr: data.inr,
        //نرخ افغانستان
        afn: data.afn,
        //نرخ سوئیس
        chf: data.chf,
        //نرخ پاکستان
        pkr: data.pkr,
        //نرخ عراق
        iqd: data.iqd,
      };
      displayRates(relevantRates);
    })
    //نمایش خطا در صورت وجود
    .catch((error) => console.error("Error fetching exchange rates:", error));

  function displayRates(rates) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // ساخت سربرگ جدول
    const headerRow = document.createElement("tr");
    //عنوان کشور
    const headerCountry = document.createElement("th");
    headerCountry.textContent = "کشور";
    //عنوان نرخ
    const headerValue = document.createElement("th");
    headerValue.textContent = "نرخ";
    //عنوان مقایسه
    const headerComparison = document.createElement("th");
    headerComparison.textContent = "مقایسه";
    //عنوان تاریخ
    const headerDate = document.createElement("th");
    headerDate.textContent = "تاریخ";
    //عنوان زمان
    const headerTimestamp = document.createElement("th");
    headerTimestamp.textContent = "آخرین بروزرسانی";
    headerRow.appendChild(headerCountry);
    headerRow.appendChild(headerValue);
    headerRow.appendChild(headerComparison);
    headerRow.appendChild(headerDate);
    headerRow.appendChild(headerTimestamp);
    thead.appendChild(headerRow);

    const countryNames = {
      usd: "آمریکا",
      cad: "کانادا",
      aud: "استرالیا",
      aed: "امارات متحده عربی",
      try: "ترکیه",
      cny: "چین",
      jpy: "ژاپن",
      krw: "کره جنوبی",
      inr: "هند",
      afn: "افغانستان",
      chf: "سوئیس",
      pkr: "پاکستان",
      iqd: "عراق",
    };

    const countryFlags = {
      usd: "🇺🇸",
      cad: "🇨🇦",
      aud: "🇦🇺",
      aed: "🇦🇪",
      try: "🇹🇷",
      cny: "🇨🇳",
      jpy: "🇯🇵",
      krw: "🇰🇷",
      inr: "🇮🇳",
      afn: "🇦🇫",
      chf: "🇨🇭",
      pkr: "🇵🇰",
      iqd: "🇮🇶",
    };

    // مقایسه نرخ ارزها با نرخ دلار
    const usdRate = parseFloat(rates["usd"].value);
    const comparisonArrows = {};

    for (const currency in rates) {
      // اگر ارز مورد نظر دلار باشد، ادامه بده
      if (currency === "usd") continue;
      const rate = parseFloat(rates[currency].value);
      // اگر نرخ ارز بیشتر از نرخ دلار باشد، نشانه گذاری با پیکان بالا، در غیر این صورت پیکان پایین
      comparisonArrows[currency] = rate > usdRate ? "🔼" : "🔽";
    }

    // ایجاد ردیف های جدول
    for (const [currency, { value, date, timestamp }] of Object.entries(
      rates
    )) {
      const row = document.createElement("tr");
      const cellCountry = document.createElement("td");
      cellCountry.innerHTML = `${countryFlags[currency]} ${countryNames[currency]}`;
      const cellValue = document.createElement("td");
      cellValue.textContent = convertToFarsiNumbers(
        formatNumberWithCommas(value)
      );
      const cellComparison = document.createElement("td");
      cellComparison.textContent = comparisonArrows[currency] || "";
      const cellDate = document.createElement("td");
      cellDate.textContent = formatDateToFarsi(date);
      const cellTimestamp = document.createElement("td");
      cellTimestamp.textContent = formatTimestampToFarsi(timestamp);
      row.appendChild(cellCountry);
      row.appendChild(cellValue);
      row.appendChild(cellComparison);
      row.appendChild(cellDate);
      row.appendChild(cellTimestamp);
      tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    ratesDiv.appendChild(table);
  }

  // تبدیل اعداد انگلیسی به اعداد فارسی
  function convertToFarsiNumbers(num) {
    const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (digit) => farsiDigits[digit]);
  }

  // اضافه کردن ویرگول به اعداد
  function formatNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // تبدیل تاریخ به فارسی
  function formatDateToFarsi(dateString) {
    const months = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];
    // تاریخ را به سه بخش تقسیم کن
    const [year, month, day] = dateString.split(" ")[0].split("-");
    const monthName = months[parseInt(month, 10) - 1];
    return `${convertToFarsiNumbers(day)} ${monthName}`;
  }

  // تبدیل زمان به فارسی
  function formatTimestampToFarsi(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${convertToFarsiNumbers(hours)}:${convertToFarsiNumbers(
      minutes
    )}:${convertToFarsiNumbers(seconds)}`;
  }
});

// از https://www.navasan.tech/webserviceguide/#http-request استفاده شده است
document.addEventListener("DOMContentLoaded", () => {
  //کلید API رایگان (۱۲۰ درخواست در روز)
  const apiKey = "freeIEnSL0pvAM6S8ZuWTcmOmf6t6Smh";
  //آدرس API
  const apiUrl = `http://api.navasan.tech/latest/?api_key=${apiKey}`;
  //دریافت المان نمایش نرخ ارز
  const ratesDiv = document.getElementById("rates");

  //درخواست اطلاعات از API
  fetch(apiUrl)
    //تبدیل پاسخ به JSON
    .then((response) => response.json())
    //نمایش نرخ ها
    .then((data) => {
      //نرخ های مرتبط با ارزهای مورد نظر
      const relevantRates = {
        //دلار آمریکا
        usd: data.usd_sell,
        //دلار کانادا
        cad: data.cad,
        //دلار استرالیا
        aud: data.aud,
        //درهم امارات متحده عربی
        aed: data.aed_sell,
        //لیر ترکیه
        try: data.try,
        //یوان چین
        cny: data.cny,
        //ین ژاپن
        jpy: data.jpy,
        //وون کره جنوبی
        krw: data.krw,
        //روپیه هند
        inr: data.inr,
        //افغانی افغانستان
        afn: data.afn,
        //فرانک سوئیس
        chf: data.chf,
        //روپیه پاکستان
        pkr: data.pkr,
        //دینار عراق
        iqd: data.iqd,
      };
      //نمایش نرخ ها
      displayRates(relevantRates);
    })
    //نمایش خطا در صورت وجود
    .catch((error) => console.error("Error fetching exchange rates:", error));

  //نمایش نرخ ها
  function displayRates(rates) {
    //ساخت جدول
    const table = document.createElement("table");
    //ساخت سرصفحه جدول
    const thead = document.createElement("thead");
    //ساخت بدنه جدول
    const tbody = document.createElement("tbody");

    //ساخت سطر سرصفحه
    const headerRow = document.createElement("tr");
    //ساخت ستون کشور
    const headerCountry = document.createElement("th");
    headerCountry.textContent = "کشور";
    //ساخت ستون نرخ
    const headerValue = document.createElement("th");
    headerValue.textContent = "نرخ";
    //ساخت ستون مقایسه با دلار
    const headerComparison = document.createElement("th");
    headerComparison.textContent = "مقایسه با دلار";
    //ساخت ستون تاریخ
    const headerDate = document.createElement("th");
    headerDate.textContent = "تاریخ";
    //ساخت ستون زمان
    const headerTimestamp = document.createElement("th");
    headerTimestamp.textContent = "آخرین به روزرسانی";
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

    //مقایسه نرخ هر ارز با دلار
    const usdRate = parseFloat(rates["usd"].value);
    const comparisonArrows = {};

    //مقایسه نرخ هر ارز با دلار
    for (const currency in rates) {
      //اگر ارز دلار باشد، ادامه بده
      if (currency === "usd") continue;
      //نرخ ارز
      const rate = parseFloat(rates[currency].value);
      //اگر نرخ ارز بیشتر از نرخ دلار باشد، نشانه گذاری با پیکان بالا، در غیر اینصورت نشانه گذاری با پیکان پایین
      comparisonArrows[currency] = rate > usdRate ? "🔼" : "🔽";
    }

    for (const [currency, { value, date, timestamp }] of Object.entries(
      rates
    )) {
      //ساخت سطر
      const row = document.createElement("tr");
      //ساخت ستون کشور
      const cellCountry = document.createElement("td");
      //نمایش پرچم کشور و نام کشور
      cellCountry.innerHTML = `${countryFlags[currency]} ${countryNames[currency]}`;
      //ساخت ستون نرخ
      const cellValue = document.createElement("td");
      //نمایش نرخ به صورت فارسی
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

  //تبدیل اعداد انگلیسی به اعداد فارسی
  function convertToFarsiNumbers(num) {
    const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (digit) => farsiDigits[digit]);
  }

  //فرمت دهی اعداد با جداکننده کاما
  function formatNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //فرمت تاریخ به فارسی
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
    //تقسیم تاریخ به سال، ماه و روز
    const [month, day] = dateString.split(" ")[0].split("-");
    const monthName = months[parseInt(month, 10) - 1];
    return `${convertToFarsiNumbers(day)} ${monthName}`;
  }

  //فرمت زمان به فارسی
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

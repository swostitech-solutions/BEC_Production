import jsPDF from "jspdf";

const safeText = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(" ").trim();
  }

  if (value && typeof value === "object") {
    return Object.values(value).filter(Boolean).join(" ").trim();
  }

  return value === null || value === undefined ? "" : String(value).trim();
};

const formatReceiptDate = (value) => {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return safeText(value);
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const formatMoneyParts = (value) => {
  const amount = Number(value) || 0;
  const absolute = Math.abs(amount);
  const [rupees, paise] = absolute.toFixed(2).split(".");

  return {
    displayRupees: amount < 0 ? `-${rupees}` : rupees,
    paise,
  };
};

const toWordsUnderThousand = (number) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (number < 20) {
    return ones[number];
  }

  if (number < 100) {
    return `${tens[Math.floor(number / 10)]} ${ones[number % 10]}`.trim();
  }

  return `${ones[Math.floor(number / 100)]} Hundred ${toWordsUnderThousand(
    number % 100,
  )}`.trim();
};

const amountToWords = (value) => {
  const amount = Math.round(Number(value) || 0);
  if (amount === 0) {
    return "Zero Rupees Only";
  }

  const chunks = [
    { divisor: 10000000, label: "Crore" },
    { divisor: 100000, label: "Lakh" },
    { divisor: 1000, label: "Thousand" },
    { divisor: 1, label: "" },
  ];

  let remaining = Math.abs(amount);
  const parts = [];

  chunks.forEach(({ divisor, label }) => {
    const chunkValue = Math.floor(remaining / divisor);
    if (!chunkValue) {
      return;
    }

    if (divisor === 1) {
      parts.push(toWordsUnderThousand(chunkValue));
    } else {
      parts.push(`${toWordsUnderThousand(chunkValue)} ${label}`.trim());
      remaining %= divisor;
    }
  });

  const prefix = amount < 0 ? "Minus " : "";
  return `${prefix}${parts.join(" ").trim()} Rupees Only`;
};

const getReceiptItems = (receiptData) => {
  const sourceItems = Array.isArray(receiptData?.payment_element_list)
    ? receiptData.payment_element_list
    : Object.values(receiptData?.payment_element_list || {});

  const normalizeKey = (value) =>
    safeText(value).toUpperCase().replace(/[^A-Z0-9]/g, "");

  const rowDefinitions = [
    { sl: "", label: "College", isHeader: true },
    { sl: "1", label: "Admission Fee", keys: ["ADDMISSIONFEES", "ADMISSIONFEE"] },
    {
      sl: "2",
      label: "Tuition Fees",
      keys: [
        "TUITIONFEE",
        "TUTIONFEESADJUSTMENT",
        "COURSEFEE",
        "ACADEMICFEES",
        "ZEROFEE",
      ],
    },
    { sl: "3", label: "Late Payment Fee", keys: ["LATEFEES"] },
    { sl: "4", label: "Uniform Fee", keys: [] },
    { sl: "5", label: "Identity Card Fee", keys: [] },
    {
      sl: "6",
      label: "Library Fees",
      keys: ["LIBRARYBOOKPENALTY"],
    },
    { sl: "7", label: "Library Caution Money", keys: [] },
    { sl: "8", label: "Library Card Fee", keys: [] },
    { sl: "9", label: "Clinical Training Fee", keys: [] },
    {
      sl: "10",
      label: "Transportation Fee",
      keys: ["TRANSPORTFEES", "TRANSPORTADJUSTMENT"],
    },
    { sl: "", label: "Book Fee", keys: [] },
    {
      sl: "",
      label: "Council Registration Fee(ONMRC)",
      keys: ["CBSEREGISTRATIONFEES"],
    },
    { sl: "", label: "University", isHeader: true },
    { sl: "", label: "  (a) Enrollment Fee", keys: [] },
    { sl: "", label: "  (b) Examination Fee", keys: ["EXAMINATIONFEES"] },
    { sl: "", label: "  (c) Fees for late Form Filling to Examination", keys: [] },
    {
      sl: "11",
      label: "Miscellaneous Fees",
      keys: [
        "FUNCTIONACTIVITYCHARGES",
        "MISCELLANEOUSCHARGES",
        "SLCCHARGES",
        "TRIPCHARGES",
        "OTHERADJUSTMENT",
      ],
    },
    { sl: "12", label: "Hostel", isHeader: true },
    { sl: "", label: "  Hostel Admission Fee", keys: [] },
    { sl: "", label: "  Hostel Caution Money", keys: [] },
    {
      sl: "",
      label: "  Hostel Fee",
      keys: ["HOSTELFEE", "HOSTELFEES"],
    },
    { sl: "", label: "  Accommodation Fee", keys: [] },
    { sl: "", label: "  Hostel Mess Fee", keys: [] },
    { sl: "", label: "Discount", keys: ["DISCOUNT"] },
    { sl: "", label: "Check Bounce", keys: ["CHECKBOUNCE"] },
    { sl: "", label: "Re Admission", keys: ["READMISSION"] },
  ];

  const amountByLabel = new Map();
  const matchedNames = new Set();

  const addAmount = (label, amount) => {
    amountByLabel.set(label, (amountByLabel.get(label) || 0) + amount);
  };

  sourceItems.forEach((item) => {
    const itemKey = normalizeKey(item?.element_name);
    const amount = Number(item?.amount ?? item?.paid_amount ?? 0);

    if (!Number.isFinite(amount)) {
      return;
    }

    const matchedRow = rowDefinitions.find(
      (row) => !row.isHeader && row.keys?.includes(itemKey),
    );

    if (matchedRow) {
      addAmount(matchedRow.label, amount);
      matchedNames.add(itemKey);
    }
  });

  const unmappedRows = sourceItems
    .filter((item) => {
      const itemKey = normalizeKey(item?.element_name);
      return itemKey && !matchedNames.has(itemKey);
    })
    .map((item) => ({
      sl: "",
      label: safeText(item?.element_name),
      amount: Number(item?.amount ?? item?.paid_amount ?? 0),
      isDynamic: true,
    }))
    .filter((item) => item.label && Number.isFinite(item.amount));

  const mappedRows = rowDefinitions.map((row) => ({
    sl: row.sl,
    label: row.label,
    isHeader: Boolean(row.isHeader),
    amount: row.isHeader ? null : amountByLabel.get(row.label) ?? null,
  }));

  if (unmappedRows.length > 0) {
    mappedRows.push(...unmappedRows);
  }

  return mappedRows;
};

export const openFeeReceiptPdf = (receiptData) => {
  const data = receiptData || {};
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const studentName = safeText(data.student_name);
  const receiptItems = getReceiptItems(data);
  const receiptDate = formatReceiptDate(data.receipt_date);
  const tableTop = 72;
  const footerTop = 246;
  const rowStart = tableTop + 14;
  const maxRows = Math.max(receiptItems.length, 18);
  const rowStep = Math.min(8, 156 / maxRows);

  doc.setLineWidth(0.5);
  doc.rect(5, 5, 200, 287);

  doc.setTextColor(0, 100, 80);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SPARSH COLLEGE OF NURSING & ALLIED SCIENCES", pageWidth / 2, 12, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.setFont("Helvetica", "normal");
  doc.text("(A unit of Nirmala Trust)", pageWidth / 2, 16, { align: "center" });
  doc.text(
    "Plot No: 154/1683/2194 & 177/2195, Kantabada, Bhubaneswar-752054",
    pageWidth / 2,
    20,
    { align: "center" },
  );
  doc.text(
    "Ph.: +91 7735504783, Email: info@sparshnursing.edu.in",
    pageWidth / 2,
    24,
    { align: "center" },
  );

  doc.setFillColor(0, 100, 80);
  doc.rect(85, 27, 40, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("RECEIPT", 105, 32, { align: "center" });

  doc.setTextColor(0, 0, 0);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Receipt No. ${safeText(data.receipt_no)}`, 140, 32);
  doc.text(`Date: ${receiptDate}`, 140, 38);

  doc.text(`Course: ${safeText(data.course_name)}`, 10, 45);
  doc.text(`Year: ${safeText(data.academic_year_code)}`, 80, 45);
  doc.text(`Adm No.: ${safeText(data.admission_no)}`, 130, 45);

  doc.text(`Department: ${safeText(data.department_name)}`, 10, 52);
  doc.text(`Semester: ${safeText(data.semester_name)}`, 80, 52);
  doc.text(`Section: ${safeText(data.section_name)}`, 140, 52);

  doc.text("Received from Ms./ Mr.:", 10, 59);
  doc.setFont("Helvetica", "bold");
  doc.text(studentName, 50, 59);
  doc.setFont("Helvetica", "normal");
  doc.text(`Father Name: ${safeText(data.father_name)}`, 10, 66);
  doc.text(`Payment Mode: ${safeText(data.payment_method)}`, 110, 66);

  doc.setFont("Helvetica", "bold");
  doc.line(10, tableTop, 200, tableTop);
  doc.text("SL NO", 12, tableTop + 5);
  doc.text("PARTICULAR", 70, tableTop + 5);
  doc.text("AMOUNT", 175, tableTop + 3, { align: "center" });
  doc.setFontSize(8);
  doc.text("Rs.", 165, tableTop + 8);
  doc.text("P.", 190, tableTop + 8);
  doc.line(10, tableTop + 10, 200, tableTop + 10);

  doc.line(10, tableTop, 10, footerTop);
  doc.line(25, tableTop, 25, footerTop);
  doc.line(155, tableTop, 155, footerTop);
  doc.line(183, tableTop, 183, footerTop);
  doc.line(200, tableTop, 200, footerTop);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);

  receiptItems.forEach((item, index) => {
    const yPos = rowStart + index * rowStep;
    const shouldShowAmount =
      !item.isHeader && item.amount !== null && item.amount !== undefined;
    const amountParts = shouldShowAmount ? formatMoneyParts(item.amount) : null;

    doc.text(item.sl, 15, yPos);
    doc.setFont("Helvetica", item.isHeader ? "bold" : "normal");
    doc.text(doc.splitTextToSize(item.label, 122), 28, yPos);

    if (amountParts) {
      doc.setFont("Helvetica", "bold");
      doc.text(amountParts.displayRupees, 180, yPos, { align: "right" });
      doc.text(amountParts.paise, 192, yPos, { align: "center" });
    }

    doc.setFont("Helvetica", "normal");
  });

  doc.line(10, footerTop, 200, footerTop);

  doc.setFont("Helvetica", "italic");
  doc.setFontSize(8.5);
  doc.text(
    doc.splitTextToSize(`Rupees in words: ${amountToWords(data.amount)}`, 118),
    10,
    footerTop + 8,
  );

  const totalParts = formatMoneyParts(data.amount);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL", 130, footerTop + 10);
  doc.text(totalParts.displayRupees, 180, footerTop + 10, {
    align: "right",
  });
  doc.text(totalParts.paise, 192, footerTop + 10, { align: "center" });

  const feeSemesters = Array.isArray(data.fee_semesters)
    ? data.fee_semesters.filter(Boolean).join(", ")
    : safeText(data.fee_semesters);
  const paymentReference = safeText(data.payment_reference);
  const remarks = safeText(data.remarks);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Fee For: ${feeSemesters || "-"}`, 10, footerTop + 20);
  doc.text(`Reference: ${paymentReference || "-"}`, 10, footerTop + 27);
  doc.text(`Remarks: ${remarks || "-"}`, 10, footerTop + 34);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Cashier Signature", 60, footerTop + 40, { align: "center" });
  doc.text("Accountant Signature", 160, footerTop + 40, { align: "center" });

  window.open(doc.output("bloburl"), "_blank");
};

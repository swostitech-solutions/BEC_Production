import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // used for READING uploaded files
import * as XLSXStyle from "xlsx-js-style"; // used for WRITING styled template
import { ApiUrl } from "../../../ApiUrl";
import { fetchWithRetry } from "../../../utils/fetchWithRetry";

// ─── Column Definitions ───────────────────────────────────────────────────────
const COLUMNS = [
  {
    key: "type",
    label: "Book/Journal Type",
    required: true,
    hint: "Values: book or journal",
  },
  {
    key: "category_name",
    label: "Category Name",
    required: true,
    hint: "Must match system category name exactly (case-insensitive)",
  },
  {
    key: "sub_category_name",
    label: "Sub Category Name",
    required: true,
    hint: "Must match system sub-category name exactly (case-insensitive)",
  },
  {
    key: "book_name",
    label: "Book Title",
    required: true,
    hint: "Full title of the book",
  },
  { key: "publisher", label: "Publisher", required: false, hint: "" },
  { key: "author", label: "Author", required: false, hint: "" },
  {
    key: "publish_year",
    label: "Publish Year",
    required: false,
    hint: "4-digit year. E.g. 2023",
  },
  { key: "volume", label: "Volume", required: false, hint: "Number. E.g. 1" },
  { key: "ISBN", label: "ISBN", required: false, hint: "" },
  { key: "edition", label: "Edition", required: false, hint: "E.g. 2nd" },
  {
    key: "pages",
    label: "Pages",
    required: false,
    hint: "Positive number. E.g. 250",
  },
  {
    key: "branch_name",
    label: "Library Branch",
    required: false,
    hint: "Must match system branch name exactly (case-insensitive)",
  },
  {
    key: "purchase_date",
    label: "Purchase Date",
    required: false,
    hint: "Format: DD-MM-YYYY",
  },
  { key: "purchase_from", label: "Purchased From", required: false, hint: "" },
  { key: "bill_no", label: "Bill No", required: false, hint: "" },
  {
    key: "no_of_copies",
    label: "No. of Copies",
    required: true,
    hint: "Positive whole number. E.g. 5",
  },
  {
    key: "bill_value",
    label: "Cost / Bill Value",
    required: false,
    hint: "Number. E.g. 500.00",
  },
  {
    key: "accession_status",
    label: "Accession Status",
    required: true,
    hint: "Values: ACTIVE, INACTIVE, LOST, or DAMAGED",
  },
  {
    key: "accession_location",
    label: "Accession Location",
    required: false,
    hint: "Must match system location name exactly (case-insensitive)",
  },
  { key: "remarks", label: "Remarks", required: false, hint: "" },
];

// Sample row values aligned with COLUMNS order
const SAMPLE_VALUES = [
  "book",
  "Science",
  "Physics",
  "Introduction to Physics",
  "Oxford University Press",
  "H.C. Verma",
  "2023",
  "1",
  "978-0-13-468599-1",
  "2nd",
  "450",
  "Main Library",
  "01-01-2024",
  "National Book Store",
  "BILL-001",
  "5",
  "500",
  "ACTIVE",
  "Rack A",
  "First acquisition batch",
];

// ─── Main Component ───────────────────────────────────────────────────────────
const BulkBookUpload = () => {
  const navigate = useNavigate();

  // ── Lookup state ──────────────────────────────────────────────────────────
  const [lookupData, setLookupData] = useState({
    categories: [], // [{id, name}]
    subCategories: {}, // {categoryId: [{id, name}]}
    branches: [], // [{id, name}]
    locations: [], // [{id, name}]
  });
  const [lookupLoading, setLookupLoading] = useState(true);
  const [lookupError, setLookupError] = useState("");
  const [retryStatus, setRetryStatus] = useState(""); // e.g. "⟳ Retrying Categories… (2/3)"

  // ── Parse / validate state ────────────────────────────────────────────────
  const [parsedRows, setParsedRows] = useState([]);
  const [skipInvalid, setSkipInvalid] = useState(false);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null); // cancels in-flight lookups on unmount

  // ── Upload state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState("upload"); // "upload" | "results"
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState([]);
  const [uploadDone, setUploadDone] = useState(false);

  // ── Warn user before leaving while uploading ──────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (isUploading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isUploading]);

  // ── Fetch all dropdown data on mount (with automatic retry + timeout) ──────
  const fetchAllLookups = useCallback(async () => {
    // Cancel any previous in-flight call (e.g. user clicks Retry rapidly)
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLookupLoading(true);
    setLookupError("");
    setRetryStatus("");

    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const token = sessionStorage.getItem("accessToken");

    // Shared retry config — 3 retries, 1s→2s→4s backoff (capped 8s), 15s per-attempt timeout
    const retryConfig = {
      retries: 3,
      baseDelay: 1000,
      maxDelay: 8000,
      timeout: 15000,
      signal: controller.signal,
    };

    let categories = [];
    let subCategoriesMap = {};
    let branches = [];
    let locations = [];
    const errors = [];

    // 1. Categories
    try {
      const catRes = await fetchWithRetry(
        `${ApiUrl.apiurl}BookCategory/GetAllBookCategoryList/`,
        { headers: { Authorization: `Bearer ${token}` } },
        {
          ...retryConfig,
          onRetry: (attempt, max, err) =>
            setRetryStatus(
              `⟳ Retrying Categories… (${attempt}/${max}) — ${err.message}`,
            ),
        },
      );
      setRetryStatus("");
      if (!catRes.ok)
        throw new Error(`Categories API error (${catRes.status})`);
      const catData = await catRes.json();
      categories = (catData.data || []).map((c) => ({
        id: c.id,
        name: c.category_name,
      }));
    } catch (err) {
      if (controller.signal.aborted) return; // component unmounted — stop silently
      setRetryStatus("");
      errors.push(`Categories: ${err.message}`);
    }

    // 2. Sub-categories — parallel, each with silent retry
    if (categories.length > 0) {
      await Promise.all(
        categories.map(async (cat) => {
          try {
            const subRes = await fetchWithRetry(
              `${ApiUrl.apiurl}BookSubCategory/GetBookSubCategoryBasedOnCategory/${cat.id}`,
              { headers: { Authorization: `Bearer ${token}` } },
              { ...retryConfig, onRetry: null }, // silent — too many parallel calls to show status
            );
            if (!subRes.ok) throw new Error(`${subRes.status}`);
            const subData = await subRes.json();
            subCategoriesMap[String(cat.id)] =
              subData.message === "Success" && Array.isArray(subData.data)
                ? subData.data.map((s) => ({
                    id: s.id,
                    name: s.Subcategory_name,
                  }))
                : [];
          } catch {
            subCategoriesMap[String(cat.id)] = [];
          }
        }),
      );
    }

    // 3. Branches
    try {
      const branchRes = await fetchWithRetry(
        `${ApiUrl.apiurl}LIBRARYBRANCH/GetLibraryBranchList/${orgId}/${branchId}/`,
        {},
        {
          ...retryConfig,
          onRetry: (attempt, max, err) =>
            setRetryStatus(
              `⟳ Retrying Branches… (${attempt}/${max}) — ${err.message}`,
            ),
        },
      );
      setRetryStatus("");
      if (!branchRes.ok)
        throw new Error(`Branches API error (${branchRes.status})`);
      const branchData = await branchRes.json();
      branches = (branchData.data || []).map((b) => ({
        id: b.library_branch_id,
        name: b.library_branch_name,
      }));
    } catch (err) {
      if (controller.signal.aborted) return;
      setRetryStatus("");
      errors.push(`Branches: ${err.message}`);
    }

    // 4. Locations
    try {
      const locRes = await fetchWithRetry(
        `${ApiUrl.apiurl}BOOK_LOCATION/GetALLBookLocationList/${orgId}/${branchId}/`,
        {},
        {
          ...retryConfig,
          onRetry: (attempt, max, err) =>
            setRetryStatus(
              `⟳ Retrying Locations… (${attempt}/${max}) — ${err.message}`,
            ),
        },
      );
      setRetryStatus("");
      if (!locRes.ok) throw new Error(`Locations API error (${locRes.status})`);
      const locData = await locRes.json();
      locations = (locData.data || []).map((l) => ({
        id: l.id,
        name: l.booklocation,
      }));
    } catch (err) {
      if (controller.signal.aborted) return;
      setRetryStatus("");
      errors.push(`Locations: ${err.message}`);
    }

    setLookupData({
      categories,
      subCategories: subCategoriesMap,
      branches,
      locations,
    });

    if (errors.length > 0) {
      setLookupError(
        `Some data failed to load after retrying: ${errors.join(" | ")}. Please click Retry.`,
      );
    }

    setLookupLoading(false);
  }, []);

  // Abort any in-flight requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    fetchAllLookups();
  }, [fetchAllLookups]);

  // ─── Download Template ────────────────────────────────────────────────────
  const downloadTemplate = () => {
    const wb = XLSXStyle.utils.book_new();

    // ── Shared styles ──────────────────────────────────────────────────────
    const greyHeader = {
      fill: { patternType: "solid", fgColor: { rgb: "BFBFBF" } },
      font: { bold: true, sz: 11 },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "888888" } },
        bottom: { style: "thin", color: { rgb: "888888" } },
        left: { style: "thin", color: { rgb: "888888" } },
        right: { style: "thin", color: { rgb: "888888" } },
      },
    };

    const requiredMark = {
      fill: { patternType: "solid", fgColor: { rgb: "FFE0E0" } },
      font: { bold: false, sz: 10, color: { rgb: "CC0000" } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const normalCell = {
      font: { sz: 10 },
      alignment: { vertical: "center" },
    };

    // ── Sheet 1: Book Data — only header row, no sample data ──────────────
    const headerLabels = COLUMNS.map((c) => c.label);
    const ws1 = XLSXStyle.utils.aoa_to_sheet([headerLabels]);
    ws1["!cols"] = COLUMNS.map(() => ({ wch: 25 }));
    ws1["!rows"] = [{ hpt: 30 }]; // taller header row

    headerLabels.forEach((_, colIdx) => {
      const addr = XLSXStyle.utils.encode_cell({ r: 0, c: colIdx });
      if (ws1[addr]) ws1[addr].s = greyHeader;
    });

    XLSXStyle.utils.book_append_sheet(wb, ws1, "Book Data");

    // ── Sheet 2: Instructions ─────────────────────────────────────────────
    const instrData = [
      ["Column Name", "Required?", "Allowed Values / Notes", "Example"],
      ...COLUMNS.map((c, i) => [
        c.label,
        c.required ? "REQUIRED" : "Optional",
        c.hint || "—",
        SAMPLE_VALUES[i] ?? "—",
      ]),
      [],
      ["IMPORTANT NOTES", "", "", ""],
      [
        "1. Do NOT rename or remove column headers in Row 1 of the 'Book Data' sheet.",
        "",
        "",
        "",
      ],
      [
        "2. Start entering your book data from Row 2 onwards in the 'Book Data' sheet.",
        "",
        "",
        "",
      ],
      [
        "3. Category Name, Sub Category Name, Library Branch, Accession Location must match the system names exactly (comparison is case-insensitive).",
        "",
        "",
        "",
      ],
      [
        "4. Accession Numbers (barcodes) are ALWAYS auto-generated by the system — you never enter them manually. The 'Do you want Book Accession No. to be auto-generated?' option is always ON for bulk upload.",
        "",
        "",
        "",
      ],
      [
        "5. Each Excel row = one book entry. If No. of Copies is 3, the system creates 3 accession records — all with the same Accession Location, Accession Status and Remarks from that row. If specific copies need different locations/status, add them individually via the Book Master form after bulk upload.",
        "",
        "",
        "",
      ],
      [
        "6. If a row has any error it will be skipped. Fix errors and re-upload, or use 'Skip invalid rows' option.",
        "",
        "",
        "",
      ],
    ];

    const ws2 = XLSXStyle.utils.aoa_to_sheet(instrData);
    ws2["!cols"] = [{ wch: 40 }, { wch: 12 }, { wch: 65 }, { wch: 35 }];
    ws2["!rows"] = [{ hpt: 30 }];

    // Style instruction header row (row 0)
    ["A1", "B1", "C1", "D1"].forEach((addr) => {
      if (ws2[addr]) ws2[addr].s = greyHeader;
    });

    // Style REQUIRED / Optional column (col B, rows 2 onwards = index 1+)
    COLUMNS.forEach((col, i) => {
      const addr = XLSXStyle.utils.encode_cell({ r: i + 1, c: 1 }); // col B
      if (ws2[addr]) {
        ws2[addr].s = col.required ? requiredMark : normalCell;
      }
    });

    XLSXStyle.utils.book_append_sheet(wb, ws2, "Instructions");

    // ── Sheet 3: Valid Values ─────────────────────────────────────────────
    const validRows = [
      ["=== VALID CATEGORY & SUB-CATEGORY NAMES (use exact spelling) ==="],
      ["Category Name", "Sub Category Names"],
    ];
    lookupData.categories.forEach((cat) => {
      const subs = (lookupData.subCategories[String(cat.id)] || []).map(
        (s) => s.name,
      );
      validRows.push([cat.name, subs.join(", ") || "(no sub-categories)"]);
    });
    validRows.push([]);
    validRows.push(["=== VALID LIBRARY BRANCH NAMES ==="]);
    lookupData.branches.forEach((b) => validRows.push([b.name]));
    validRows.push([]);
    validRows.push(["=== VALID ACCESSION LOCATION NAMES ==="]);
    lookupData.locations.forEach((l) => validRows.push([l.name]));
    validRows.push([]);
    validRows.push(["=== FIXED ENUM VALUES ==="]);
    validRows.push(["Book/Journal Type", "book, journal"]);
    validRows.push(["Accession Status", "ACTIVE, INACTIVE, LOST, DAMAGED"]);

    const ws3 = XLSXStyle.utils.aoa_to_sheet(validRows);
    ws3["!cols"] = [{ wch: 35 }, { wch: 80 }];
    // Style the two section label rows with grey
    [0, 1].forEach((r) => {
      ["A", "B"].forEach((col) => {
        const addr = `${col}${r + 1}`;
        if (ws3[addr]) ws3[addr].s = greyHeader;
      });
    });
    XLSXStyle.utils.book_append_sheet(wb, ws3, "Valid Values");

    XLSXStyle.writeFile(wb, "Library_Book_Bulk_Upload_Template.xlsx");
  };

  // ─── Parse & Validate uploaded file ──────────────────────────────────────
  const MAX_ROWS = 500; // hard cap per upload
  const MAX_FILE_MB = 5; // hard cap on file size
  const MAX_COPIES = 500; // max copies per single book row

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(ext)) {
      alert("Please upload a valid Excel file (.xlsx or .xls).");
      e.target.value = "";
      return;
    }

    // File size guard
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      alert(
        `File is too large. Maximum allowed size is ${MAX_FILE_MB} MB. Please split your data into smaller batches.`,
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, {
          type: "binary",
          cellDates: false,
        });

        // Prefer "Book Data" sheet; fall back to first sheet
        const sheetName = workbook.SheetNames.includes("Book Data")
          ? "Book Data"
          : workbook.SheetNames[0];

        const ws = workbook.Sheets[sheetName];
        const allRows = XLSX.utils.sheet_to_json(ws, {
          defval: "",
          raw: false,
        });

        // ── Silently drop fully-blank rows (no data in ANY column) ────────
        const rawRows = allRows.filter((row) =>
          Object.values(row).some((v) => String(v).trim() !== ""),
        );

        if (!rawRows.length) {
          alert(
            "The Excel file contains no data rows. Please fill in the template and re-upload.",
          );
          e.target.value = "";
          return;
        }

        // Row count cap
        if (rawRows.length > MAX_ROWS) {
          alert(
            `This file has ${rawRows.length} data rows. Maximum allowed per upload is ${MAX_ROWS} rows.\n\nPlease split your data into batches of ${MAX_ROWS} or fewer rows.`,
          );
          e.target.value = "";
          return;
        }

        // ── Header validation ──────────────────────────────────────────────
        const fileHeaders = Object.keys(rawRows[0]);
        const expectedLabels = COLUMNS.map((c) => c.label);
        const missingHeaders = expectedLabels.filter(
          (h) => !fileHeaders.includes(h),
        );

        if (missingHeaders.length > 0) {
          alert(
            `The Excel file is missing the following columns:\n\n${missingHeaders.join("\n")}\n\nPlease use the provided template and do not rename column headers.`,
          );
          e.target.value = "";
          return;
        }

        // ── Row-level validation ───────────────────────────────────────────
        const validated = validateRows(rawRows, MAX_COPIES);
        setParsedRows(validated);
        setSkipInvalid(false);
      } catch (err) {
        alert(`Error reading Excel file: ${err.message}`);
        e.target.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  // ─── Row Validation ───────────────────────────────────────────────────────
  const validateRows = (rawRows, maxCopies = 500) => {
    // Build case-insensitive lookup maps
    const categoryMap = {};
    lookupData.categories.forEach((c) => {
      categoryMap[c.name.trim().toLowerCase()] = c;
    });

    // subCategoryMap: categoryId (string) -> { subName(lower) -> subObj }
    const subCategoryMap = {};
    Object.entries(lookupData.subCategories).forEach(([catId, subs]) => {
      subCategoryMap[catId] = {};
      subs.forEach((s) => {
        subCategoryMap[catId][s.name.trim().toLowerCase()] = s;
      });
    });

    const branchMap = {};
    lookupData.branches.forEach((b) => {
      branchMap[b.name.trim().toLowerCase()] = b;
    });

    const locationMap = {};
    lookupData.locations.forEach((l) => {
      locationMap[l.name.trim().toLowerCase()] = l;
    });

    // ── Normalise any date Excel might output -> YYYY-MM-DD, or null if invalid ─
    //    Accepted inputs:
    //      DD-MM-YYYY        (what the user intends to type)
    //      M/D/YY, M/D/YYYY  (Excel auto-converts dates to this locale format)
    //      YYYY-MM-DD        (ISO — safe fallback)
    const normalizeDate = (str) => {
      if (!str) return null;

      // DD-MM-YYYY
      const dmy = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (dmy) {
        const [, d, mo, y] = dmy.map(Number);
        if (
          mo < 1 ||
          mo > 12 ||
          d < 1 ||
          y < 1800 ||
          y > new Date().getFullYear() + 1
        )
          return null;
        if (d > new Date(y, mo, 0).getDate()) return null;
        return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      }

      // M/D/YY or M/D/YYYY  ← Excel auto-converts typed dates to this
      const mdy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (mdy) {
        let [, mo, d, y] = mdy.map(Number);
        if (y < 100) y += y < 50 ? 2000 : 1900; // 2-digit year expansion
        if (
          mo < 1 ||
          mo > 12 ||
          d < 1 ||
          y < 1800 ||
          y > new Date().getFullYear() + 1
        )
          return null;
        if (d > new Date(y, mo, 0).getDate()) return null;
        return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      }

      // YYYY-MM-DD (ISO)
      const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (iso) {
        const [, y, mo, d] = iso.map(Number);
        if (
          mo < 1 ||
          mo > 12 ||
          d < 1 ||
          y < 1800 ||
          y > new Date().getFullYear() + 1
        )
          return null;
        if (d > new Date(y, mo, 0).getDate()) return null;
        return str;
      }

      return null; // unrecognised format
    };

    // ── ISBN validator (10 or 13 digits, optional hyphens) ──────────────────
    const isValidISBN = (str) => {
      const digits = str.replace(/[-\s]/g, "");
      return /^\d{10}$/.test(digits) || /^\d{13}$/.test(digits);
    };

    return rawRows.map((row, idx) => {
      const errors = [];
      const excelRow = idx + 2;

      const get = (label) => String(row[label] ?? "").trim();
      const getU = (label) => get(label).toUpperCase();

      // ── Required + enum checks ─────────────────────────────────────────

      // type
      const type = get("Book/Journal Type").toLowerCase();
      if (!type) {
        errors.push("Book/Journal Type is required");
      } else if (!["book", "journal"].includes(type)) {
        errors.push(
          `Book/Journal Type must be 'book' or 'journal' — got: '${type}'`,
        );
      }

      // category
      const categoryName = get("Category Name");
      let categoryId = null;
      if (!categoryName) {
        errors.push("Category Name is required");
      } else {
        const found = categoryMap[categoryName.toLowerCase()];
        if (!found) {
          errors.push(`Category '${categoryName}' not found in system`);
        } else {
          categoryId = found.id;
        }
      }

      // sub-category
      const subCategoryName = get("Sub Category Name");
      let subCategoryId = null;
      if (!subCategoryName) {
        errors.push("Sub Category Name is required");
      } else if (categoryId !== null) {
        const catSubs = subCategoryMap[String(categoryId)] || {};
        const foundSub = catSubs[subCategoryName.toLowerCase()];
        if (!foundSub) {
          errors.push(
            `Sub Category '${subCategoryName}' not found under category '${categoryName}'`,
          );
        } else {
          subCategoryId = foundSub.id;
        }
      }

      // book title
      const bookName = get("Book Title");
      if (!bookName) {
        errors.push("Book Title is required");
      } else if (bookName.length > 255) {
        errors.push(
          `Book Title must be 255 characters or fewer (got: ${bookName.length})`,
        );
      }

      // author / publisher length checks
      const author = get("Author");
      const publisher = get("Publisher");
      if (author.length > 255)
        errors.push(
          `Author must be 255 characters or fewer (got: ${author.length})`,
        );
      if (publisher.length > 255)
        errors.push(
          `Publisher must be 255 characters or fewer (got: ${publisher.length})`,
        );

      // no_of_copies — must be a strict positive INTEGER (no decimals)
      const noCopiesStr = get("No. of Copies");
      let noCopies = 0;
      if (!noCopiesStr) {
        errors.push("No. of Copies is required");
      } else if (!/^\d+$/.test(noCopiesStr)) {
        // rejects decimals like "5.5", negatives like "-1", non-numeric
        errors.push(
          `No. of Copies must be a positive whole number with no decimals — got: '${noCopiesStr}'`,
        );
      } else {
        noCopies = parseInt(noCopiesStr, 10);
        if (noCopies <= 0) {
          errors.push(
            `No. of Copies must be at least 1 — got: '${noCopiesStr}'`,
          );
        } else if (noCopies > maxCopies) {
          errors.push(
            `No. of Copies cannot exceed ${maxCopies} per row — got: ${noCopies}. Split into multiple rows if needed.`,
          );
        }
      }

      // accession status
      const accessionStatus = getU("Accession Status");
      if (!accessionStatus) {
        errors.push("Accession Status is required");
      } else if (
        !["ACTIVE", "INACTIVE", "LOST", "DAMAGED"].includes(accessionStatus)
      ) {
        errors.push(
          `Accession Status must be ACTIVE, INACTIVE, LOST, or DAMAGED — got: '${accessionStatus}'`,
        );
      }

      // ── Optional numeric / format checks ──────────────────────────────

      const publishYear = get("Publish Year");
      if (publishYear) {
        const yr = parseInt(publishYear, 10);
        if (
          !/^\d{4}$/.test(publishYear) ||
          yr < 1800 ||
          yr > new Date().getFullYear() + 1
        ) {
          errors.push(
            `Publish Year must be a valid 4-digit year — got: '${publishYear}'`,
          );
        }
      }

      const volume = get("Volume");
      if (volume) {
        const volNum = parseFloat(volume);
        if (isNaN(volNum) || volNum <= 0) {
          errors.push(`Volume must be a positive number — got: '${volume}'`);
        }
      }

      const pages = get("Pages");
      if (pages) {
        if (!/^\d+$/.test(pages) || parseInt(pages, 10) <= 0) {
          errors.push(
            `Pages must be a positive whole number — got: '${pages}'`,
          );
        }
      }

      // Purchase Date — accept DD-MM-YYYY, M/D/YY, M/D/YYYY, YYYY-MM-DD (Excel may auto-convert)
      const purchaseDateRaw = get("Purchase Date");
      let normalizedPurchaseDate = "";
      if (purchaseDateRaw) {
        const nd = normalizeDate(purchaseDateRaw);
        if (!nd) {
          errors.push(
            `Purchase Date must be a valid date in DD-MM-YYYY format (e.g. 15-08-2023) — got: '${purchaseDateRaw}' (note: Excel may auto-reformat dates; if so, set the cell format to Text before typing)`,
          );
        } else {
          normalizedPurchaseDate = nd; // stored as YYYY-MM-DD internally
        }
      }

      // bill value — must be non-negative number
      const billValue = get("Cost / Bill Value");
      if (billValue) {
        const bv = parseFloat(billValue);
        if (isNaN(bv)) {
          errors.push(
            `Cost / Bill Value must be a number — got: '${billValue}'`,
          );
        } else if (bv < 0) {
          errors.push(
            `Cost / Bill Value cannot be negative — got: '${billValue}'`,
          );
        }
      }

      // ISBN — if provided, must be 10 or 13 digits
      const ISBN = get("ISBN");
      if (ISBN && !isValidISBN(ISBN)) {
        errors.push(
          `ISBN must be a valid 10-digit or 13-digit number (hyphens allowed) — got: '${ISBN}'`,
        );
      }

      // Remarks length
      const remarks = get("Remarks");
      if (remarks.length > 500) {
        errors.push(
          `Remarks must be 500 characters or fewer (got: ${remarks.length})`,
        );
      }

      // ── Optional dropdown resolution ───────────────────────────────────

      const branchName = get("Library Branch");
      let branchId = null;
      if (branchName) {
        const found = branchMap[branchName.toLowerCase()];
        if (!found) {
          errors.push(`Library Branch '${branchName}' not found in system`);
        } else {
          branchId = found.id;
        }
      }

      const locationName = get("Accession Location");
      let locationId = null;
      if (locationName) {
        const found = locationMap[locationName.toLowerCase()];
        if (!found) {
          errors.push(
            `Accession Location '${locationName}' not found in system`,
          );
        } else {
          locationId = found.id;
        }
      }

      return {
        excelRow,
        type: type || "book",
        categoryId,
        subCategoryId,
        bookName,
        publisher,
        author,
        publishYear,
        volume,
        ISBN,
        edition: get("Edition"),
        pages,
        branchId,
        purchaseDate: normalizedPurchaseDate, // already YYYY-MM-DD or ""
        purchaseFrom: get("Purchased From"),
        billNo: get("Bill No"),
        noCopies,
        billValue,
        accessionStatus,
        locationId,
        remarks,
        errors,
        isValid: errors.length === 0,
      };
    });
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const parsePurchaseDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString().split("T")[0];
    // dateStr is already normalised to YYYY-MM-DD by validateRows;
    // this fallback handles any edge-case that slips through
    const iso = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return dateStr;
    const d = new Date(dateStr);
    if (!isNaN(d)) return d.toISOString().split("T")[0];
    return new Date().toISOString().split("T")[0];
  };

  const fetchNextBarcode = async () => {
    try {
      const res = await fetch(`${ApiUrl.apiurl}LIBRARYBOOK/NextbarcodeNo/`);
      const data = await res.json();
      if (data.message === "success") return data.next_barcode;
      return null;
    } catch {
      return null;
    }
  };

  const uploadSingleRow = async (
    row,
    orgId,
    branchId,
    academicYearId,
    loginId,
  ) => {
    // Get auto-gen starting barcode from backend BEFORE this submission
    const startBarcode = await fetchNextBarcode();

    const libraryBookdetails = {
      loginId,
      academicyearId: academicYearId,
      book_name: row.bookName,
      library_branch_Id: row.branchId || null,
      book_category_Id: row.categoryId,
      book_sub_category_Id: row.subCategoryId,
      book_status: "ACTIVE",
      total_no_of_copies: row.noCopies,
      publisher: row.publisher || "",
      author: row.author || "",
      publish_year: row.publishYear || new Date().getFullYear().toString(),
      volume: row.volume ? parseInt(row.volume, 10) : null,
      ISBN: row.ISBN || "",
      edition: row.edition || "",
      pages: row.pages ? parseInt(row.pages, 10) : null,
      barcode_auto_generated: true,
      createdDate: new Date().toISOString().split("T")[0],
      allow_issue: "T",
      type: row.type,
      IssueNo: "ISS001",
      Period: "Annual",
      org_id: orgId,
      branch_id: branchId,
    };

    const librarypurchesDetails = [
      {
        loginId,
        academicyearId: academicYearId,
        book_name: row.bookName,
        library_branch_Id: row.branchId || null,
        book_category_Id: row.categoryId,
        created_by: loginId,
        purchase_date: parsePurchaseDate(row.purchaseDate),
        purchase_from: row.purchaseFrom || "",
        bill_no: row.billNo || "",
        bill_value: row.billValue ? row.billValue.toString() : "0",
        bill_concession: "0",
        no_of_copies: row.noCopies.toString(),
      },
    ];

    // Build N accession entries — one per copy, with sequential auto-gen barcodes
    const libraryBookBarcodeDetails = Array.from(
      { length: row.noCopies },
      (_, i) => ({
        barcode: startBarcode
          ? (parseInt(startBarcode, 10) + i).toString()
          : `AUTO_${row.bookName || "BOOK"}_${i + 1}`,
        book_barcode_status: row.accessionStatus,
        org_id: orgId,
        branch_id: branchId,
        locationId: row.locationId || null,
        created_by: loginId,
        remarks: row.remarks || "",
        barcode_auto_generated: true,
      }),
    );

    const formData = new FormData();
    formData.append("created_by", loginId.toString());
    formData.append("libraryBookdetails", JSON.stringify(libraryBookdetails));
    formData.append(
      "librarypurchesDetails",
      JSON.stringify(librarypurchesDetails),
    );
    formData.append(
      "libraryBookBarcodeDetails",
      JSON.stringify(libraryBookBarcodeDetails),
    );

    const res = await fetch(`${ApiUrl.apiurl}LIBRARYBOOK/BOOK_CREATE/`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data?.message || data?.detail || data?.error || JSON.stringify(data),
      );
    }
    return data;
  };

  // ─── Start Upload ─────────────────────────────────────────────────────────
  const handleUpload = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (!validRows.length) {
      alert("No valid rows to upload.");
      return;
    }

    const orgId = parseInt(localStorage.getItem("orgId"), 10);
    const branchId = parseInt(localStorage.getItem("branchId"), 10);
    const academicYearId =
      parseInt(localStorage.getItem("academicSessionId"), 10) || null;
    // userId: try sessionStorage first (normal flow), fall back to localStorage (new-tab scenario)
    const loginId = parseInt(
      sessionStorage.getItem("userId") || localStorage.getItem("userId"),
      10,
    );

    // Guard: check only for NaN (missing key) — don't reject 0, it's a valid ID in some setups
    if (isNaN(orgId) || isNaN(loginId)) {
      alert(
        "Session data is incomplete (orgId or userId is missing).\n" +
          "Please log out, log back in, and try again.",
      );
      return;
    }

    setIsUploading(true);
    setUploadResults([]);
    setUploadProgress(0);
    setUploadDone(false);
    setStep("results");

    const results = [];
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        await uploadSingleRow(row, orgId, branchId, academicYearId, loginId);
        results.push({
          excelRow: row.excelRow,
          bookName: row.bookName,
          success: true,
          error: null,
        });
      } catch (err) {
        results.push({
          excelRow: row.excelRow,
          bookName: row.bookName,
          success: false,
          error: err.message,
        });
      }
      setUploadResults([...results]);
      setUploadProgress(Math.round(((i + 1) / validRows.length) * 100));
    }

    setIsUploading(false);
    setUploadDone(true);
  };

  // ─── Download Error Report ────────────────────────────────────────────────
  const downloadErrorReport = () => {
    const failed = uploadResults.filter((r) => !r.success);
    if (!failed.length) return;

    const wsData = [
      ["Row (Excel)", "Book Title", "Error Details"],
      ...failed.map((r) => [r.excelRow, r.r.bookName, r.error]),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = [{ wch: 12 }, { wch: 15 }, { wch: 40 }, { wch: 70 }];
    XLSX.utils.book_append_sheet(wb, ws, "Failed Rows");
    XLSX.writeFile(wb, "Bulk_Upload_Error_Report.xlsx");
  };

  // ─── Derived counts ───────────────────────────────────────────────────────
  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;
  const successCount = uploadResults.filter((r) => r.success).length;
  const failedCount = uploadResults.filter((r) => !r.success).length;

  const canUpload = validCount > 0 && (skipInvalid || invalidCount === 0);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              {/* ── Page Title ──────────────────────────────────────────── */}
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                BULK BOOK UPLOAD
              </p>

              {/* ── Top buttons ─────────────────────────────────────────── */}
              <div className="row mb-2 mt-3 mx-0">
                <div className="col-12 p-2 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-success me-2"
                    style={{ width: "200px" }}
                    onClick={downloadTemplate}
                    disabled={lookupLoading || !!lookupError}
                  >
                    Download Template
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{ width: "150px" }}
                    disabled={isUploading}
                    onClick={() => {
                      setParsedRows([]);
                      setSkipInvalid(false);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/admbookMaster")}
                    disabled={isUploading}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* ── Lookup loading / error banners ───────────────────────── */}
              {lookupLoading && (
                <div className="alert alert-info mx-3">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {retryStatus
                    ? retryStatus
                    : "Loading system data (categories, branches, locations)…"}
                </div>
              )}

              {lookupError && (
                <div className="alert alert-danger mx-3 d-flex align-items-center gap-3">
                  <span>{lookupError}</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={fetchAllLookups}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* ── Main content (only when lookups ready) ───────────────── */}
              {!lookupLoading && !lookupError && (
                <>
                  {/* ════════════════ UPLOAD STEP ════════════════ */}
                  {step === "upload" && (
                    <div className="mx-3">
                      {/* Step 1 — Download Template */}
                      <div className="card border mb-4 mt-2">
                        <div className="card-body">
                          <h6 className="fw-bold mb-1">
                            Step 1 &nbsp;—&nbsp; Download Excel Template
                          </h6>
                          <p
                            className="text-muted mb-3"
                            style={{ fontSize: "13px" }}
                          >
                            Download the standardized template, fill in your
                            book data (one row per book), then upload it in Step
                            2. Do <strong>not</strong> rename or remove column
                            headers.
                          </p>

                          {/* Quick reference: available values */}
                          <div
                            className="mt-1 p-3 rounded"
                            style={{ background: "#f8f9fa", fontSize: "12px" }}
                          >
                            <strong>
                              Available system values for dropdown columns
                            </strong>
                            <span
                              className="text-danger ms-1"
                              style={{ fontSize: "12px" }}
                            >
                              (use only these exact values — any other value
                              will cause that row to fail)
                            </span>

                            {/* Categories + their Sub-categories together */}
                            <div className="mt-2">
                              <span className="text-muted me-1 fw-semibold">
                                Categories &amp; Sub-categories:
                              </span>
                              {lookupData.categories.length === 0 && (
                                <em>None loaded</em>
                              )}
                            </div>
                            {lookupData.categories.map((cat) => (
                              <div
                                key={cat.id}
                                className="mb-1"
                                style={{ paddingLeft: "8px" }}
                              >
                                <strong>{cat.name}</strong>
                                <span className="text-muted mx-1">→</span>
                                <span>
                                  {(
                                    lookupData.subCategories[String(cat.id)] ||
                                    []
                                  ).length > 0 ? (
                                    (
                                      lookupData.subCategories[
                                        String(cat.id)
                                      ] || []
                                    )
                                      .map((s) => s.name)
                                      .join(", ")
                                  ) : (
                                    <em className="text-muted">
                                      no sub-categories
                                    </em>
                                  )}
                                </span>
                              </div>
                            ))}

                            <div className="mt-2">
                              <span className="text-muted me-1 fw-semibold">
                                Library Branches ({lookupData.branches.length}):
                              </span>
                              {lookupData.branches.length ? (
                                lookupData.branches
                                  .map((b) => b.name)
                                  .join(", ")
                              ) : (
                                <em>None loaded</em>
                              )}
                            </div>

                            <div className="mt-1">
                              <span className="text-muted me-1 fw-semibold">
                                Accession Locations (
                                {lookupData.locations.length}):
                              </span>
                              {lookupData.locations.length ? (
                                lookupData.locations
                                  .map((l) => l.name)
                                  .join(", ")
                              ) : (
                                <em>None loaded</em>
                              )}
                            </div>

                            <div
                              className="mt-2"
                              style={{ color: "#0d6efd", fontSize: "11px" }}
                            >
                              The downloaded template includes a{" "}
                              <strong>"Valid Values"</strong> sheet with all
                              these names for easy offline reference.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 — Upload & Validate */}
                      <div className="card border mb-4">
                        <div className="card-body">
                          <h6 className="fw-bold mb-1">
                            Step 2 &nbsp;—&nbsp; Upload &amp; Validate
                          </h6>
                          <p
                            className="text-muted mb-3"
                            style={{ fontSize: "13px" }}
                          >
                            Upload your filled Excel file. All rows will be
                            validated before any data is sent to the server.
                          </p>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            className="form-control"
                            style={{ maxWidth: "420px" }}
                            onChange={handleFileChange}
                          />

                          {/* ── Validation Results ─────────────────────── */}
                          {parsedRows.length > 0 && (
                            <div className="mt-4">
                              {/* Summary badges */}
                              <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
                                <span
                                  className="badge bg-secondary"
                                  style={{ fontSize: "13px" }}
                                >
                                  Total rows: {parsedRows.length}
                                </span>
                                <span
                                  className="badge bg-success"
                                  style={{ fontSize: "13px" }}
                                >
                                  ✓ Valid: {validCount}
                                </span>
                                {invalidCount > 0 && (
                                  <span
                                    className="badge bg-danger"
                                    style={{ fontSize: "13px" }}
                                  >
                                    ✗ Errors: {invalidCount}
                                  </span>
                                )}
                              </div>

                              {/* Skip invalid checkbox */}
                              {invalidCount > 0 && (
                                <div className="form-check mb-3">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="skipInvalid"
                                    checked={skipInvalid}
                                    onChange={(e) =>
                                      setSkipInvalid(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="skipInvalid"
                                  >
                                    Skip invalid rows and upload only the{" "}
                                    <strong>{validCount} valid</strong> row(s)
                                  </label>
                                </div>
                              )}

                              {/* Preview table */}
                              <div
                                className="table-responsive"
                                style={{
                                  maxHeight: "400px",
                                  overflowY: "auto",
                                  border: "1px solid #dee2e6",
                                }}
                              >
                                <table className="table table-bordered table-sm mb-0">
                                  <thead
                                    className="table-light"
                                    style={{
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                    }}
                                  >
                                    <tr>
                                      <th>Row</th>
                                      <th>Book Title</th>
                                      <th>Category</th>
                                      <th>Sub Category</th>
                                      <th>Copies</th>
                                      <th style={{ minWidth: "280px" }}>
                                        Validation
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {parsedRows.map((row, idx) => (
                                      <tr
                                        key={idx}
                                        className={
                                          row.isValid ? "" : "table-danger"
                                        }
                                      >
                                        <td>{row.excelRow}</td>
                                        <td>
                                          {row.bookName || (
                                            <em className="text-muted">
                                              empty
                                            </em>
                                          )}
                                        </td>
                                        <td>
                                          {row.categoryId ? (
                                            lookupData.categories.find(
                                              (c) => c.id === row.categoryId,
                                            )?.name || row.categoryId
                                          ) : (
                                            <em className="text-danger">—</em>
                                          )}
                                        </td>
                                        <td>
                                          {row.subCategoryId ? (
                                            (
                                              lookupData.subCategories[
                                                String(row.categoryId)
                                              ] || []
                                            ).find(
                                              (s) => s.id === row.subCategoryId,
                                            )?.name || row.subCategoryId
                                          ) : (
                                            <em className="text-danger">—</em>
                                          )}
                                        </td>
                                        <td>{row.noCopies || 0}</td>
                                        <td>
                                          {row.isValid ? (
                                            <span className="text-success fw-bold">
                                              ✓ Valid
                                            </span>
                                          ) : (
                                            <ul
                                              className="mb-0 ps-3"
                                              style={{ fontSize: "11px" }}
                                            >
                                              {row.errors.map((err, i) => (
                                                <li
                                                  key={i}
                                                  className="text-danger"
                                                >
                                                  {err}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Upload trigger */}
                              <div className="mt-3">
                                {canUpload ? (
                                  <button
                                    className="btn btn-primary"
                                    style={{ width: "260px" }}
                                    onClick={handleUpload}
                                  >
                                    Start Upload ({validCount} book
                                    {validCount !== 1 ? "s" : ""})
                                  </button>
                                ) : (
                                  <div
                                    className="alert alert-warning mb-0"
                                    style={{ maxWidth: "520px" }}
                                  >
                                    <strong>
                                      ⚠️ {invalidCount} row(s) have errors.
                                    </strong>{" "}
                                    Fix them and re-upload, or check "Skip
                                    invalid rows" above to upload only the{" "}
                                    {validCount} valid row(s).
                                  </div>
                                )}

                                {invalidCount > 0 &&
                                  skipInvalid &&
                                  validCount === 0 && (
                                    <div
                                      className="alert alert-danger mt-2 mb-0"
                                      style={{ maxWidth: "520px" }}
                                    >
                                      All rows have errors — there is nothing
                                      valid to upload. Please fix the errors and
                                      re-upload.
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ════════════════ RESULTS STEP ════════════════ */}
                  {step === "results" && (
                    <div className="mx-3">
                      <div className="card border mb-4 mt-2">
                        <div className="card-body">
                          <h6 className="fw-bold mb-3">Upload Progress</h6>

                          {/* Progress bar */}
                          <div
                            className="progress mb-2"
                            style={{ height: "26px" }}
                          >
                            <div
                              className={`progress-bar ${isUploading ? "progress-bar-striped progress-bar-animated" : ""} bg-primary`}
                              role="progressbar"
                              style={{ width: `${uploadProgress}%` }}
                            >
                              {uploadProgress}%
                            </div>
                          </div>

                          {isUploading && (
                            <p
                              className="text-muted mb-3"
                              style={{ fontSize: "13px" }}
                            >
                              Uploading <strong>{uploadResults.length}</strong>{" "}
                              of{" "}
                              <strong>
                                {parsedRows.filter((r) => r.isValid).length}
                              </strong>{" "}
                              book(s)… Please do not close this tab.
                            </p>
                          )}

                          {/* Done summary */}
                          {uploadDone && (
                            <>
                              <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
                                <span
                                  className="badge bg-success"
                                  style={{ fontSize: "14px" }}
                                >
                                  ✓ Success: {successCount}
                                </span>
                                {failedCount > 0 && (
                                  <span
                                    className="badge bg-danger"
                                    style={{ fontSize: "14px" }}
                                  >
                                    ✗ Failed: {failedCount}
                                  </span>
                                )}
                              </div>

                              {failedCount > 0 && (
                                <button
                                  className="btn btn-warning mb-3"
                                  style={{ width: "240px" }}
                                  onClick={downloadErrorReport}
                                >
                                  📥 Download Error Report
                                </button>
                              )}

                              <div className="d-flex gap-2 flex-wrap">
                                <button
                                  className="btn btn-primary"
                                  style={{ width: "200px" }}
                                  onClick={() => {
                                    setParsedRows([]);
                                    setUploadResults([]);
                                    setUploadDone(false);
                                    setUploadProgress(0);
                                    setStep("upload");
                                    // Reset file input so same file can be re-selected
                                    if (fileInputRef.current)
                                      fileInputRef.current.value = "";
                                  }}
                                >
                                  Upload Another File
                                </button>
                              </div>
                            </>
                          )}

                          {/* Live results table */}
                          {uploadResults.length > 0 && (
                            <div
                              className="table-responsive mt-4"
                              style={{
                                maxHeight: "420px",
                                overflowY: "auto",
                                border: "1px solid #dee2e6",
                              }}
                            >
                              <table className="table table-bordered table-sm mb-0">
                                <thead
                                  className="table-light"
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                  }}
                                >
                                  <tr>
                                    <th>#</th>
                                    <th>Excel Row</th>
                                    <th>Book Title</th>
                                    <th>Result</th>
                                    <th>Error Details</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {uploadResults.map((res, idx) => (
                                    <tr
                                      key={idx}
                                      className={
                                        res.success ? "" : "table-danger"
                                      }
                                    >
                                      <td>{idx + 1}</td>
                                      <td>{res.excelRow}</td>
                                      <td>{res.bookCode}</td>
                                      <td>{res.bookName}</td>
                                      <td>
                                        {res.success ? (
                                          <span className="text-success fw-bold">
                                            ✓ Success
                                          </span>
                                        ) : (
                                          <span className="text-danger fw-bold">
                                            ✗ Failed
                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        {res.error ? (
                                          <small className="text-danger">
                                            {res.error}
                                          </small>
                                        ) : (
                                          <small className="text-muted">
                                            —
                                          </small>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkBookUpload;


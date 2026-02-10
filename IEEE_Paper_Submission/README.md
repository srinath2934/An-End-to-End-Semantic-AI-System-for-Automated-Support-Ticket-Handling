# IEEE PAPER SUBMISSION PACKAGE
## Smart Support Ticket Classification System

**Conference:** ICPCSN 2026  
**Submission Deadline:** February 2, 2026  
**Paper Type:** Conference Paper (6-8 pages)

---

## 📁 PACKAGE CONTENTS

This folder contains all files required for IEEE paper submission:

### 1. **ieee_paper_v3.tex** (Main LaTeX File)
- Complete paper source code
- 6 pages, IEEE conference format
- Includes all sections, tables, algorithms, and references

### 2. **IEEEtran.cls** (IEEE Template Class)
- Official IEEE conference template
- Required for compilation
- Do not modify this file

### 3. **Images (3 files)**
- **fig1.png** - System Architecture Diagram
- **fig2.png** - ML Pipeline Flow Diagram
- **fig3.png** - Smart Dashboard Screenshot

### 4. **ICPCSN_2026_Submission.pdf** (Compiled PDF)
- Final camera-ready PDF
- 6 pages
- Ready for submission

### 5. **README.md** (This file)
- Instructions and requirements

---

## 🔧 COMPILATION INSTRUCTIONS

### Option 1: Using Overleaf (Recommended)
1. Go to https://www.overleaf.com/
2. Create new project → Upload Project
3. Upload this entire folder as a ZIP file
4. Overleaf will automatically compile
5. Download the PDF

### Option 2: Using Local LaTeX (MiKTeX/TeX Live)
```bash
# Compile twice for references
pdflatex ieee_paper_v3.tex
pdflatex ieee_paper_v3.tex
```

**Required Packages:**
- IEEEtran
- cite
- amsmath, amssymb, amsfonts
- algorithmic, algorithm
- graphicx
- textcomp
- xcolor
- listings
- url

---

## 📋 FILE REQUIREMENTS CHECKLIST

✅ **LaTeX Source:** ieee_paper_v3.tex  
✅ **Template Class:** IEEEtran.cls  
✅ **Images:** fig1.png, fig2.png, fig3.png  
✅ **Compiled PDF:** ICPCSN_2026_Submission.pdf  
✅ **Page Count:** 6 pages (within 6-8 limit)  
✅ **Format:** IEEE Conference 2-column  
✅ **Authors:** 6 authors in 2x3 grid  
✅ **References:** 30 citations  

---

## 📄 PAPER STRUCTURE

1. **Title & Authors** (6-member grid)
2. **Nomenclature** (11 symbols defined)
3. **Abstract** (150 words)
4. **Keywords** (7 keywords)
5. **Introduction** (Problem context)
6. **Problem Statement** (Objectives O1-O7)
7. **Related Work** (Literature comparison table)
8. **Methodology** (5-phase pipeline + algorithm)
9. **Architecture** (4-layer system)
10. **Experiments** (Dataset + results tables)
11. **Discussion** (Error analysis, robustness)
12. **Deployment** (DevOps, ethics)
13. **Hardware Benchmarking** (Performance table)
14. **Conclusion** (Achievements + future work)
15. **References** (30 citations)
16. **Appendices** (Code, biographies, privacy)

---

## 👥 AUTHORS

1. **Tamilselvan J** - tamilselvanjegan408@gmail.com
2. **Srinath S** - srinath@email.com
3. **Pradeep R** - pradeepraja948@gmail.com
4. **Nagoor appa M** - er.nagoorappa@gmail.com
5. **Author 5** - (Placeholder)
6. **Author 6** - (Placeholder)

**Affiliation:** Department of Artificial Intelligence and Data Science, JCT College of Engineering and Technology, Coimbatore, India

---

## 🎯 KEY METRICS

- **Accuracy:** 94.2%
- **Inference Latency:** 120ms
- **Dataset Size:** 28,587 tickets
- **Categories:** 5 (Billing, Refund, Cancellation, Product, Technical)
- **F1-Score:** 0.92 (overall)

---

## 📊 TABLES & FIGURES

**Tables (7 total):**
1. Literature Review Comparison
2. SBERT Variants Comparison
3. Per-Category Metrics
4. Dataset Statistics
5. Confusion Matrix
6. Hardware Performance
7. Hyperparameters

**Figures (3 total):**
1. System Architecture (4-layer stack)
2. ML Pipeline (5-phase flow)
3. Dashboard Interface

**Algorithms (1):**
- Algorithm 1: Prediction Orchestration

---

## 🚀 SUBMISSION CHECKLIST

Before submitting to ICPCSN 2026:

- [ ] Verify all 6 authors have correct emails
- [ ] Check all 3 images are included
- [ ] Confirm page count is 6-8 pages
- [ ] Ensure PDF compiles without errors
- [ ] Review abstract for clarity
- [ ] Verify all references are formatted correctly
- [ ] Check that tables fit within columns
- [ ] Confirm author affiliations are complete
- [ ] Test PDF on different devices
- [ ] Create backup ZIP of all files

---

## 📦 CREATING SUBMISSION ZIP

```bash
# Windows
Compress-Archive -Path "IEEE_Paper_Submission\*" -DestinationPath "ICPCSN_2026_Submission.zip"

# Linux/Mac
zip -r ICPCSN_2026_Submission.zip IEEE_Paper_Submission/
```

**ZIP should contain:**
- ieee_paper_v3.tex
- IEEEtran.cls
- fig1.png
- fig2.png
- fig3.png
- README.md (optional)

---

## ⚠️ IMPORTANT NOTES

1. **Do NOT modify IEEEtran.cls** - Use as-is
2. **Keep image filenames** - fig1.png, fig2.png, fig3.png (referenced in LaTeX)
3. **Compile twice** - Required for references and cross-references
4. **Check page count** - Must be 6-8 pages
5. **Plagiarism check** - Ensure <15% similarity (ICPCSN requirement)

---

## 🔍 TROUBLESHOOTING

**Problem:** Images not showing  
**Solution:** Ensure fig1.png, fig2.png, fig3.png are in the same folder as .tex file

**Problem:** References not appearing  
**Solution:** Compile twice with pdflatex

**Problem:** Page count wrong  
**Solution:** Check if all packages are installed correctly

**Problem:** Author grid broken  
**Solution:** Ensure `\linebreakand` command is defined in preamble

---

## 📞 CONTACT

For questions about the paper content:
- **Primary Contact:** Tamilselvan J (tamilselvanjegan408@gmail.com)
- **Technical Lead:** Srinath S (srinath@email.com)

For LaTeX/compilation issues:
- Check Overleaf documentation: https://www.overleaf.com/learn
- IEEE template guide: https://www.ieee.org/conferences/publishing/templates.html

---

## 📅 VERSION HISTORY

- **v3 (Final)** - February 3, 2026
  - 6 pages achieved
  - All content finalized
  - Ready for ICPCSN 2026 submission

- **v2** - January 2026
  - Author grid fixed
  - Images integrated

- **v1** - December 2025
  - Initial draft

---

**Last Updated:** February 4, 2026  
**Status:** ✅ Ready for Submission  
**Conference:** ICPCSN 2026

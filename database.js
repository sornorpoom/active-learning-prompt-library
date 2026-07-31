/**
 * database3.js
 * Handles data loading from local "prompt library - library v1.csv" file.
 * Specific to index3.html version.
 */

(function () {
    const LOCAL_CSV_PATH = "prompt library - library v1.csv";

    // Category mappings (Thai to English keys used in HTML data attributes)
    const categoryMap = {
        "อาชีพ": "Career",
        "วัฒนธรรม": "Culture",
        "อาหาร": "Food",
        "บุคคล": "Person",
        "ยานพาหนะ": "Vehicle",
        "เชียงใหม่": "Chiangmai",
        "สื่อการสอน": "Media",
        "กีฬา": "Other",
        "ทิวทัศน์": "Other",
        "อื่นๆ": "Other"
    };

    // Category abbreviations for prompt code generation (e.g. PM-CAR-001)
    const catCodeMap = {
        "อาชีพ": "CAR",
        "วัฒนธรรม": "CUL",
        "อาหาร": "FOO",
        "บุคคล": "PER",
        "ยานพาหนะ": "VEH",
        "เชียงใหม่": "CHI",
        "สื่อการสอน": "MED",
        "กีฬา": "SPO",
        "ทิวทัศน์": "LAN",
        "อื่นๆ": "OTH"
    };

    // Subject mappings based on category
    const subjectMap = {
        "อาชีพ": "กิจกรรมแนะแนวอาชีพ",
        "วัฒนธรรม": "สังคมศึกษา ศาสนา และวัฒนธรรม",
        "อาหาร": "การงานอาชีพ (คหกรรม)",
        "บุคคล": "ศิลปะ (การออกแบบและการเล่าเรื่อง)",
        "ยานพาหนะ": "วิทยาศาสตร์และเทคโนโลยี / ฟิสิกส์",
        "เชียงใหม่": "บูรณาการท้องถิ่นศึกษา / สังคมศึกษา",
        "สื่อการสอน": "เทคโนโลยีสารสนเทศ / นวัตกรรมการเรียนรู้",
        "กีฬา": "สุขศึกษาและพลศึกษา",
        "ทิวทัศน์": "วิทยาศาสตร์ (สิ่งแวดล้อมและทิวทัศน์)",
        "อื่นๆ": "กิจกรรมพัฒนาผู้เรียน"
    };

    // Educational application tips based on category
    const applicationTipsMap = {
        "อาชีพ": "<ul><li>ใช้จัดกิจกรรมโฮมรูมหรือคาบแนะแนวเพื่อวิเคราะห์บุคลิกภาพความถนัด</li><li>ให้นักเรียนสวมบทบาทจำลองในอาชีพต่างๆ (Roleplay) เพื่อพัฒนาทักษะชีวิต</li><li>บูรณาการในวิชาภาษาไทยหรือสังคมศึกษาสำหรับการเล่าเรื่องความฝันในอนาคต</li></ul>",
        "วัฒนธรรม": "<ul><li>ใช้ประกอบวิชาประวัติศาสตร์ล้านนาหรือศิลปะ เพื่อให้นักเรียนเห็นภาพอัตลักษณ์ทางวัฒนธรรมที่ชัดเจน</li><li>ใช้เป็นภาพกระตุ้นความตระหนักรู้ (Visual Trigger) ก่อนเริ่มอภิปรายเรื่องมรดกทางวัฒนธรรม</li><li>นำไปสร้างสื่อสิ่งพิมพ์หรือโปสเตอร์ประชาสัมพันธ์งานโรงเรียน</li></ul>",
        "อาหาร": "<ul><li>ใช้สอนในวิชาคหกรรมเพื่อวิเคราะห์สารอาหารและการออกแบบตกแต่งจาน (Food Styling)</li><li>ให้นักเรียนคิดค้นสูตรหรือสร้างแบรนด์เครื่องดื่ม/อาหารเพื่อสุขภาพของตนเอง</li><li>บูรณาการด้านการคำนวณต้นทุน/กำไรในวิชาคณิตศาสตร์เบื้องต้น</li></ul>",
        "บุคคล": "<ul><li>ใช้เรียนรู้ด้านทัศนศิลป์และการออกแบบตัวละคร (Character Design) ทั้งสัดส่วนและโทนสี</li><li>ใช้เป็นภาพกระตุ้นจินตนาการสำหรับการเขียนเชิงสร้างสรรค์หรือแต่งนิทานภาษาไทย</li><li>ใช้เป็นตัวละครแทน (Avatar) ในโครงการหรือการนำเสนอโครงงานวิชาการของนักเรียน</li></ul>",
        "ยานพาหนะ": "<ul><li>อธิบายเรื่องกลไก พลังงาน และการขับเคลื่อนในวิชาวิทยาศาสตร์และเทคโนโลยี</li><li>สอนทักษะการอ่านแบบ เขียนแบบอุตสาหกรรม และสิทธิบัตรเชิงวิศวกรรม</li><li>ให้นักเรียนฝึกวาดรูปสัดส่วนยานพาหนะที่คิดค้นขึ้นเองในวิชาศิลปะสร้างสรรค์</li></ul>",
        "เชียงใหม่": "<ul><li>ใช้ในกิจกรรมวิชาบูรณาการท้องถิ่นศึกษา เพื่อแนะนำสถานที่สำคัญและวิถีชีวิตเชียงใหม่</li><li>ให้นักเรียนประยุกต์ทำใบงานแนะนำแหล่งท่องเที่ยวของชุมชนตนเองตามแบบ</li><li>ใช้สอนวิชาภูมิศาสตร์และวิทยาศาสตร์สิ่งแวดล้อมของผืนป่าภาคเหนือ</li></ul>",
        "สื่อการสอน": "<ul><li>คุณครูสามารถนำโครงสร้าง prompt ไปใช้สร้างชุดกิจกรรมการเรียนรู้แบบ Active Learning</li><li>ประยุกต์โครงสร้าง 2x2 grid ในการออกแบบเกมการศึกษา บอร์ดเกม หรือบัตรภาพคำศัพท์</li><li>ใช้สอนวิชาเทคโนโลยีสารสนเทศเพื่อให้ผู้เรียนคุ้นเคยกับการควบคุมการสั่งการ AI</li></ul>",
        "กีฬา": "<ul><li>ใช้เป็นสื่อประกอบการเรียนการสอนรายวิชาสุขศึกษาและพลศึกษาในเรื่องการทำงานร่วมกันเป็นทีม</li><li>ประยุกต์ออกแบบสื่อประชาสัมพันธ์การจัดกิจกรรมกีฬาสีในโรงเรียน</li><li>ศึกษารูปแบบความเคลื่อนไหวทางร่างกาย (Body Movement/Kinesiology) จากภาพโพส</li></ul>",
        "ทิวทัศน์": "<ul><li>ใช้สอนวิทยาศาสตร์สิ่งแวดล้อมและนิเวศวิทยาเกี่ยวกับความสมบูรณ์ทางระบบนิเวศ</li><li>ใช้เป็นแบบฝึกหัดสำหรับนักเรียนวิชาศิลปะในการสเก็ตช์ภาพทิวทัศน์ธรรมชาติ (Landscape Drawing)</li><li>สร้างแรงบันดาลใจในการจัดค่ายกิจกรรมอนุรักษ์ธรรมชาติ</li></ul>",
        "อื่นๆ": "<ul><li>ใช้จัดกิจกรรมบูรณาการความรู้ข้ามกลุ่มสาระการเรียนรู้ในระดับสถานศึกษา</li><li>เป็นไอเดียสร้างสรรค์ในการทำสติกเกอร์ โปสการ์ด หรือผลิตภัณฑ์ของที่ระลึกโรงเรียน</li><li>ฝึกฝนการใช้ภาษาอังกฤษและสัญลักษณ์ควบคุมใน Prompt ระดับสูง</li></ul>"
    };

    /**
     * Helper to extract a title from the prompt content
     */
    function extractTitle(promptText, category, index) {
        if (!promptText) return `${category} #${index}`;

        const cleanPrompt = promptText.trim();

        // 1. Look for explicit title tags/markers
        const explicitPatterns = [
            /MAIN_TITLE_TH:\s*["“]?([^"”\r\n]+)["”]?/i,
            /TITLE_TEXT:\s*["“]?([^"”\r\n]+)["”]?/i,
            /MAIN_TITLE:\s*["“]?([^"”\r\n]+)["”]?/i,
            /BRAND_NAME_TH:\s*["“]?([^"”\r\n]+)["”]?/i,
            /The topic is\s*["“]?([^"”\r\n\.]+)/i
        ];

        for (let pattern of explicitPatterns) {
            const match = cleanPrompt.match(pattern);
            if (match && match[1]) {
                let val = match[1].trim();
                return val.replace(/^[“"']+|[”"']+$/g, '');
            }
        }

        // 2. Look for quotes at the beginning of the prompt (e.g. “Ultra-clean modern...)
        const quoteMatch = cleanPrompt.match(/^["“]([^"”\r\n]+)["”]/);
        if (quoteMatch && quoteMatch[1] && quoteMatch[1].length < 80) {
            return quoteMatch[1].trim();
        }

        // 3. Look for "Do this for a [something] => create a [something]" pattern
        const arrowMatch = cleanPrompt.match(/Do\s+this\s+for\s+a\s+([^,=\n]+)/i);
        if (arrowMatch && arrowMatch[1]) {
            let val = arrowMatch[1].trim();
            return val.charAt(0).toUpperCase() + val.slice(1);
        }

        // 4. Default: Take the first line, clean it and truncate if too long
        const lines = cleanPrompt.split('\n')
            .map(l => l.trim())
            .filter(l => l && !l.startsWith('<') && !l.startsWith('*') && !l.startsWith('-'));

        if (lines.length > 0) {
            let firstLine = lines[0];
            firstLine = firstLine.replace(/[`'"]/g, '');
            if (firstLine.length > 60) {
                return firstLine.substring(0, 60) + "...";
            }
            return firstLine;
        }

        return `${category} #${index}`;
    }

    /**
     * Helper to generate a friendly description in concise academic Thai
     */
    function generateDescription(promptText, category) {
        if (!promptText) return `สื่อการเรียนรู้เชิงทัศน์ในหมวดหมู่${category}`;

        const textLower = promptText.toLowerCase();

        // 1. Check by category and prompt keywords for dynamic academic Thai translation
        if (category === "ยานพาหนะ") {
            if (textLower.includes("patent") || textLower.includes("blueprint")) {
                return "พิมพ์เขียวสิทธิบัตรเชิงวิศวกรรม แสดงโครงสร้างกลไกและชิ้นส่วนแบบแยกชิ้น (Exploded View) ในรูปแบบตาราง 2x2 grid เพื่อการศึกษาและวิเคราะห์เทคโนโลยีทางกลศาสตร์";
            }
            return "แบบจำลองสถาปัตยกรรมยานพาหนะและการเดินทางเชิงเทคโนโลยีเพื่อการศึกษาเชิงโครงสร้างกายภาพ";
        }
        
        if (category === "สื่อการสอน") {
            if (textLower.includes("gacha") || textLower.includes("capsule") || textLower.includes("toy")) {
                return "ภาพประกอบจำลองโมเดลของเล่นสามมิติขนาดเล็ก (Chibi/Gachapon) สำหรับประยุกต์ทำชุดกิจกรรมการเรียนรู้แบบ Active Learning เพื่อการกระตุ้นความสนใจและจินตนาการของผู้เรียน";
            }
            if (textLower.includes("famous scientists") || textLower.includes("scientists")) {
                return "ชุดบัตรภาพการศึกษาจำลองนักวิทยาศาสตร์และบุคคลสำคัญในสไตล์คาแรกเตอร์สร้างสรรค์สำหรับการสอนประวัติศาสตร์วิทยาศาสตร์";
            }
            if (textLower.includes("infographic") || textLower.includes("editorial")) {
                return "อินโฟกราฟิกนำเสนอแผนภาพและโครงสร้างความรู้อย่างเป็นระบบ เพื่อเพิ่มประสิทธิภาพในการทำความเข้าใจเชิงทัศน์แก่นักเรียน";
            }
            return "ชุดสื่อการเรียนรู้อัจฉริยะเชิงภาพประกอบเพื่อยกระดับทักษะและการคิดวิเคราะห์ในชั้นเรียนยุคดิจิทัล";
        }

        if (category === "บุคคล") {
            if (textLower.includes("clay") || textLower.includes("sculpture")) {
                return "แบบจำลองคาแรกเตอร์สไตล์ประติมากรรมดินปั้นสะท้อนอัตลักษณ์ล้านนา สำหรับงานออกแบบตัวละครและการเล่าเรื่องเชิงทัศนศิลป์";
            }
            if (textLower.includes("pose") || textLower.includes("action sheet") || textLower.includes("16-panel")) {
                return "แผ่นภาพวิเคราะห์ท่าทางการเคลื่อนไหวสรีระจำลอง (Character Action Pose Sheet) แบบตารางพิกัด เพื่อเป็นต้นแบบทัศนศิลป์และการแสดงพฤติกรรม";
            }
            return "สื่อการศึกษาการออกแบบทัศนศิลป์บุคคลและการวิเคราะห์สัดส่วนทางกายภาพเชิงการออกแบบสร้างสรรค์";
        }

        if (category === "เชียงใหม่") {
            if (textLower.includes("travel poster") || textLower.includes("top 10")) {
                return "สื่อโปสเตอร์ส่งเสริมการท่องเที่ยวสร้างสรรค์จังหวัดเชียงใหม่ สไตล์ภาพประกอบแบบภาพปะติด (Collage) แสดงพิกัดสำคัญเพื่อพัฒนาทักษะบูรณาการท้องถิ่นศึกษา";
            }
            if (textLower.includes("doiหลวง") || textLower.includes("เชียงดาว") || textLower.includes("national geographic")) {
                return "โปสเตอร์ภาพทิวทัศน์ธรรมชาติเชิงนิเวศวิทยาและการอนุรักษ์ระดับพรีเมียม เพื่อการรณรงค์และสร้างความตระหนักรู้ด้านการจัดการทรัพยากรท้องถิ่น";
            }
            return "สื่อภาพประกอบทัศนียภาพสถาปัตยกรรมท้องถิ่นเพื่อการเรียนรู้ภูมิศาสตร์กายภาพและศิลปวัฒนธรรมเชียงใหม่";
        }

        if (category === "วัฒนธรรม") {
            if (textLower.includes("ร่มบ่อสร้าง") || textLower.includes("umbrella") || textLower.includes("bo sang")) {
                return "แบบจำลองหัตถศิลป์และการออกแบบลวดลายจิตรกรรมร่มบ่อสร้าง เพื่อใช้ศึกษาประวัติศาสตร์ศิลป์และหัตถกรรมสิ่งทอพื้นบ้านล้านนา";
            }
            return "งานออกแบบทัศนศิลป์ผสมผสานมรดกทางวัฒนธรรมและภูมิปัญญาล้านนา เพื่อการเรียนรู้เชิงประวัติศาสตร์และศิลปวิทยาการท้องถิ่น";
        }

        if (category === "อาหาร") {
            if (textLower.includes("lemongrass") || textLower.includes("drink") || textLower.includes("infographic")) {
                return "อินโฟกราฟิกการสื่อสารสุขภาวะและโภชนาการ แสดงขั้นตอนคัดสรรและแปรรูปสมุนไพรธรรมชาติเพื่อคหกรรมศาสตร์ศึกษา";
            }
            return "ภาพประกอบเชิงโภชนาการและการออกแบบตำรับอาหารเพื่อพัฒนาผลิตภัณฑ์ท้องถิ่นและการสื่อสารแบรนด์สินค้าทางคหกรรม";
        }

        if (category === "อาชีพ") {
            if (textLower.includes("crayon") || textLower.includes("draw") || textLower.includes("child")) {
                return "สื่อวิเคราะห์พัฒนาการและจิตวิทยาเด็กผ่านภาพวาดสีเทียนจำลองขั้นตอนงานฝีมือประดิษฐ์สร้างสรรค์ เพื่อศึกษาทักษะการประสานงานกล้ามเนื้อและการคิดเชิงจินตนาการ";
            }
            return "แผนภาพขั้นตอนการประกอบวิชาชีพและกระบวนการทำงานเชิงระบบสำหรับการจัดกิจกรรมแนะแนวอาชีพและการพัฒนาศักยภาพผู้เรียน";
        }

        if (category === "กีฬา") {
            return "การสร้างสรรค์สื่อทัศน์ศึกษาพฤติกรรมการเคลื่อนไหวทางพลศึกษา การรณรงค์การสร้างเสริมความสามัคคีและการแข่งขันกีฬาระดับสากล";
        }

        if (category === "ทิวทัศน์") {
            return "โปสเตอร์การศึกษาระบบนิเวศน์ทางธรรมชาติและวิทยาศาสตร์สิ่งแวดล้อมกายภาพ เพื่อปลูกฝังจิตสำนึกในการอนุรักษ์ความหลากหลายทางชีวภาพ";
        }

        // Default fallback
        return `สื่อภาพประกอบและแม่แบบคำสั่ง AI หมวดหมู่${category} เพื่อประยุกต์ออกแบบนวัตกรรมการเรียนการสอนและการเรียนรู้แบบบูรณาการ`;
    }

    /**
     * Parser for the local CSV file
     */
    function parseCSV(csvText) {
        const rows = [];
        let currentRow = [''];
        let inQuotes = false;

        for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            const nextChar = csvText[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentRow[currentRow.length - 1] += '"';
                    i++; // skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                currentRow.push('');
            } else if ((char === '\r' || char === '\n') && !inQuotes) {
                if (char === '\r' && nextChar === '\n') {
                    i++;
                }
                rows.push(currentRow);
                currentRow = [''];
            } else {
                currentRow[currentRow.length - 1] += char;
            }
        }
        if (currentRow.length > 1 || currentRow[0] !== '') {
            rows.push(currentRow);
        }

        // Header row validation
        if (rows.length === 0) return [];
        const header = rows[0].map(h => h.trim().toLowerCase());
        
        // Find indices
        const tsIdx = header.indexOf('timestamp');
        const catIdx = header.indexOf('category');
        const promptIdx = header.indexOf('prompt');
        const imgIdx = header.indexOf('image url');

        const dataRows = [];
        for (let i = 1; i < rows.length; i++) {
            const r = rows[i];
            if (r.length < 2) continue; // Skip empty rows
            
            dataRows.push({
                timestampRaw: r[tsIdx !== -1 ? tsIdx : 0] || "",
                category: r[catIdx !== -1 ? catIdx : 1] || "",
                prompt: r[promptIdx !== -1 ? promptIdx : 2] || "",
                imageUrl: r[imgIdx !== -1 ? imgIdx : 3] || ""
            });
        }

        return processRows(dataRows);
    }

    /**
     * Map raw row data to normalized prompt objects
     */
    function processRows(rawRows) {
        // Skip header row if it leaked in
        const filtered = rawRows.filter(r => r.category && r.category.toLowerCase() !== "category");
        
        // Group by category to generate sequential codes
        const categoryCounts = {};

        return filtered.map((row) => {
            const rawCat = (row.category || "อื่นๆ").trim();
            const engCat = categoryMap[rawCat] || "Other";
            const catPrefix = catCodeMap[rawCat] || "OTH";

            if (!categoryCounts[catPrefix]) {
                categoryCounts[catPrefix] = 0;
            }
            categoryCounts[catPrefix]++;

            // Format ID, e.g. PM-CAR-001
            const countStr = String(categoryCounts[catPrefix]).padStart(3, '0');
            const id = `PM-${catPrefix}-${countStr}`;

            const formattedTimestamp = row.timestampRaw ? row.timestampRaw.trim() : "";
            const promptText = row.prompt || "";
            const imageUrl = row.imageUrl || "";

            const title = extractTitle(promptText, rawCat, categoryCounts[catPrefix]);
            const subject = subjectMap[rawCat] || "กิจกรรมพัฒนาผู้เรียน";
            const description = generateDescription(promptText, rawCat);
            const application = applicationTipsMap[rawCat] || "<ul><li>สามารถประยุกต์ใช้ในการจัดกิจกรรมการเรียนรู้บูรณาการแบบ Active Learning</li></ul>";

            return {
                id,
                timestamp: formattedTimestamp,
                category: engCat,
                categoryThai: rawCat,
                promptText,
                imageUrl,
                title,
                subject,
                description,
                application
            };
        });
    }

    async function fetchPrompts() {
        console.log(`Fetching local prompts database from: ${LOCAL_CSV_PATH}...`);
        try {
            // Only use fetch if served via HTTP/HTTPS, avoiding CORS issues on file:// protocol
            if (window.location.protocol.startsWith("http")) {
                const response = await fetch(LOCAL_CSV_PATH);
                if (response.ok) {
                    const text = await response.text();
                    const data = parseCSV(text);
                    console.log(`Successfully loaded ${data.length} prompts from ${LOCAL_CSV_PATH} via HTTP fetch.`);
                    return data;
                }
            }
            throw new Error("Local file:// protocol or fetch failed. Initiating script fallback.");
        } catch (error) {
            console.warn("Failed to fetch CSV file. Falling back to embedded PromptDataV1 script data...", error);
            if (window.PromptDataV1 && Array.isArray(window.PromptDataV1)) {
                console.log(`Successfully loaded ${window.PromptDataV1.length} prompts from embedded PromptDataV1.`);
                return processRows(window.PromptDataV1);
            } else {
                console.error("Critical: No embedded PromptDataV1 fallback array found.");
                throw error;
            }
        }
    }

    // Attach to global window object
    window.PromptDatabase = {
        fetchPrompts: fetchPrompts
    };
})();

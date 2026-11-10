import { embedPDF } from "../Server/src/service/embedPdf.js";

const main = async () => {
  try {
    await embedPDF(
      "documents/6ad2169604421872accb3c3d/91ecca7c-4c06-45a8-a66a-b6a98d4e6ae3.pdf",
      "6ad5e4bbef08af1167929287"
    );

    console.log("PDF embedding completed!");
  } catch (error) {
    console.error("PDF embedding failed:", error);
  }
};

main();
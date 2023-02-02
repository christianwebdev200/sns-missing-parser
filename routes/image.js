var express = require("express");
var router = express.Router();
var missingSns = require("../missing-hires-sns.json");
var groupedMissingSns = require("../missing-sns-chunk.json");
var generatedLinks = require("../missing-generated-links.json");
/**
 * // 47 Brand

"https://www.ssactivewear.com/marketing/imagelibrary?id=1558&bd=&md=&pd=44044-S_44045-S_44046-S_44047-S&b=7";



// Adidas
"https://www.ssactivewear.com/marketing/imagelibrary?id=1444&bd=&md=&pd=26114-F_26114-B_26114-DS&b=31";

"https://www.ssactivewear.com/marketing/imagelibrary?id=16&bd=&md=&pd=16813-F_16813-B_16813-DS_16787-F_16787-S_16787-B_33476-F_33476-B_33476-DS_33477-F_33477-B_33477-DS_33496-F_33496-B_33496-DS_33499-F_33499-B_33499-DS_33483-F_33483-B_33483-DS_16785-F_16785-B_16785-DS&b=35";
 * 
`
https://www.ssactivewear.com/marketing/imagelibrary?id=6519&

bd=& <--brand

md=68696-F_68696-S_68696-B_68691-F_68691-S_68691-B <--model
&
pd=68691-F_68691-B_68691-DS_68699-F_68699-B_68699-DS_68697-F_68697-B_68697-DS&b=51 <--colors, F, B ,DS
``https://www.ssactivewear.com/marketing/imagelibrary?

id=1
&
bd=
&
md=96719
&
pd=96719-F_96719-B
&
b=1`; 

**/

module.exports = router;

var sample = {
  productId: "96719",
  brandId: "1",
  styleId: 10,
  parts: {
    styleImage: true,
    colorFrontImage: true,
    colorSideImage: false,
    colorBackImage: true,
  },
};

var baseUrl = "https://www.ssactivewear.com/marketing/imagelibrary?";

const chunk = (inputArray, perChunk) => {
  return inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
};

function allColorsGenerateLink() {
  return Object.keys(groupedMissingSns).reduce((chunks, key) => {
    const [brandId, styleId] = key.split("-");
    const items = groupedMissingSns[key];

    const params = items.reduce(
      (result, { productId, parts }) => {
        if (parts.colorFrontImage === false) result.pd.push(`${productId}-F`);

        if (parts.colorBackImage === false) result.pd.push(`${productId}-B`);

        return result;
      },
      {
        id: styleId,
        bd: "",
        b: brandId,
        pd: [],
        md: [],
      }
    );

    const pds = chunk(params.pd, 10).map(
      (productIds) =>
        baseUrl +
        new URLSearchParams({
          ...params,
          pd: productIds.join("_"),
          md: [],
        })
    );

    return [...chunks, ...pds];
  }, []);
}

function modelOnlyColorGenerateLink() {
  return Object.keys(groupedMissingSns).reduce((chunks, key) => {
    const [brandId, styleId] = key.split("-");
    const items = groupedMissingSns[key];

    const params = items.reduce(
      (result, { productId, parts }) => {
        if (parts.styleImage === false) {
          result.md.push(`${productId}-F`);
          result.pd.push(`${productId}-F`);
        }

        return result;
      },
      {
        id: styleId,
        bd: "",
        b: brandId,
        pd: [],
        md: [],
      }
    );

    // chunk pd
    const mds = chunk(params.md, 10).map(
      (productIds) =>
        baseUrl +
        new URLSearchParams({
          ...params,
          md: productIds.join("_"),
          pd: [],
        })
    );

    const pds = chunk(params.pd, 10).map(
      (productIds) =>
        baseUrl +
        new URLSearchParams({
          ...params,
          pd: productIds.join("_"),
          md: [],
        })
    );

    return [...chunks, ...mds, ...pds];
  }, []);
}

function sidesOnlyColorGenerateLink() {
  return Object.keys(groupedMissingSns).reduce((chunks, key) => {
    const [brandId, styleId] = key.split("-");
    const items = groupedMissingSns[key];

    const params = items.reduce(
      (result, { productId, parts }) => {
        if (parts.colorSideImage === false) {
          result.pd.push(`${productId}-S`);
          result.pd.push(`${productId}-DS`);
        }

        return result;
      },
      {
        id: styleId,
        bd: "",
        b: brandId,
        pd: [],
        md: [],
      }
    );

    const pds = chunk(params.pd, 10).map(
      (productIds) =>
        baseUrl +
        new URLSearchParams({
          ...params,
          pd: productIds.join("_"),
          md: [],
        })
    );

    return [...chunks, ...pds];
  }, []);
}

var generatedLinks = [
  "https://www.ssactivewear.com/marketing/imagelibrary?id=10&bd=&b=1&pd=105362-F_105362-B_105363-F_105363-B_105365-F_105365-B_105361-F_105361-B_105366-F_105366-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=10&bd=&b=1&pd=105368-F_105368-B_105367-F_105367-B_5280-F_5280-B_64445-F_64445-B_32269-F_32269-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=10&bd=&b=1&pd=32270-F_32270-B_32274-F_32274-B_32271-F_32271-B_32268-F_32268-B_32272-F_32272-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=10&bd=&b=1&pd=32275-F_32275-B_32273-F_32273-B_64444-F_64444-B_64446-F_64446-B_31088-F_31088-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=10&bd=&b=1&pd=105364-F_105364-B_16659-F_16659-B_32267-F_32267-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=12&bd=&b=9&pd=46258-F_46258-B_33001-F_33001-B_42426-F_42426-B_3931-F_3931-B_46256-F_46256-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=12&bd=&b=9&pd=49679-F_49679-B_66982-F_66982-B_42420-F_42420-B_42421-F_42421-B_42422-F_42422-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=12&bd=&b=9&pd=3931-F_3931-B_3931-F_3931-B_3931-F_3931-B_42423-F_42423-B_42424-F_42424-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=12&bd=&b=9&pd=42425-F_42425-B_46018-F_46018-B_3931-F_3931-B_66983-F_66983-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=15&bd=&b=23&pd=&md=16764-F_16777-F_16765-F_16766-F_16769-F_16770-F_16771-F_16782-F_16778-F_27237-F",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=15&bd=&b=23&pd=&md=16784-F",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=3633&bd=&b=7&pd=&md=43884-F_43992-F_43993-F_43994-F_43995-F",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=3633&bd=&b=7&pd=43884-F_43884-B_43992-F_43992-B_43993-F_43993-B_43994-F_43994-B_43995-F_43995-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=16&bd=&b=35&pd=g500-F_g500-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=18&bd=&b=7&pd=&md=16830-F_16832-F_16836-F_16837-F_16833-F_16835-F",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=21&bd=&b=41&pd=16852-F_16852-B_42112-F_42112-B_16854-F_16854-B_31665-F_31665-B_31666-F_31666-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=21&bd=&b=41&pd=49243-F_49243-B_16862-F_16862-B_16863-F_16863-B_49244-F_49244-B_49245-F_49245-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=24&bd=&b=5&pd=43571-F_43571-B_51879-F_51879-B_43564-F_43564-B_32574-F_32574-B_43566-F_43566-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=24&bd=&b=5&pd=43556-F_43556-B_43558-F_43558-B_32578-F_32578-B_51855-F_51855-B_32576-F_32576-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=24&bd=&b=5&pd=32577-F_32577-B_43560-F_43560-B_51858-F_51858-B_51862-F_51862-B_43562-F_43562-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=24&bd=&b=5&pd=82444-F_82444-B_43569-F_43569-B_51875-F_51875-B_51870-F_51870-B_32575-F_32575-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=24&bd=&b=5&pd=43563-F_43563-B_82443-F_82443-B_43567-F_43567-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=28&bd=&b=1&pd=97647-F_97647-B_97648-F_97648-B_105355-F_105355-B_105357-F_105357-B_32259-F_32259-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=28&bd=&b=1&pd=105356-F_105356-B_97651-F_97651-B_53267-F_53267-B_105359-F_105359-B_105354-F_105354-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=28&bd=&b=1&pd=97666-F_97666-B_97669-F_97669-B_32260-F_32260-B_105358-F_105358-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=29&bd=&b=5&pd=43533-F_43533-B_32566-F_32566-B_32571-F_32571-B_51905-F_51905-B_32573-F_32573-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=29&bd=&b=5&pd=43541-F_43541-B_32573-F_32573-B_51906-F_51906-B_45716-F_45716-B_51910-F_51910-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=29&bd=&b=5&pd=45719-F_45719-B_51920-F_51920-B_51955-F_51955-B_45717-F_45717-B_45718-F_45718-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=29&bd=&b=5&pd=-F_-B_51934-F_51934-B_43548-F_43548-B_45720-F_45720-B_51951-F_51951-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=29&bd=&b=5&pd=43549-F_43549-B_51937-F_51937-B_43550-F_43550-B_51954-F_51954-B_51906-F_51906-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=29&bd=&b=5&pd=43552-F_43552-B_45723-F_45723-B_51937-F_51937-B_66032-F_66032-B_43529-F_43529-B&md=",
  "https://www.ssactivewear.com/marketing/imagelibrary?id=29&bd=&b=5&pd=43540-F_43540-B_66031-F_66031-B_32569-F_32569-B_32568-F_32568-B_43546-F_43546-B&md=",
];



async function downloadFile(url, filename) {
  const res = await fetch(url);
  const blob = await res.blob();
  const newBlob = new Blob([blob]);

  const blobUrl = window.URL.createObjectURL(newBlob);
  const extension = "zip";
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", `${filename}.${extension}`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  // clean up Url
  window.URL.revokeObjectURL(blobUrl);
}

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

async function downloadFiles() {
  for (var i = 0; i < generatedLinks.length; i++) {
    await downloadFile(generatedLinks[i], 'images-'+i);
    await timer(1000);
  }
}

await downloadFiles()

// var i = 1;

// function myLoop() {
//   setTimeout(function() {
//     console.log('hello');
//     i++;
//     if (i < generatedLinks.length) {
//       myLoop();
//     }
//   }, 3000)
// }

// myLoop();

// await downloadFiles();

router.get("/all-colors-generate-links", function (req, res, next) {
  res.status(200).json(allColorsGenerateLink());
});

router.get("/model-generate-links", function (req, res, next) {
  res.status(200).json(modelOnlyColorGenerateLink());
});

router.get("/sides-only-generate-links", function (req, res, next) {
  res.status(200).json(sidesOnlyColorGenerateLink());
});

/* GET users listing. */
router.get("/parse", function (req, res, next) {
  res.status(200).json(
    Object.keys(missingSns).reduce((brands, gtin) => {
      const item = missingSns[gtin];
      if (!brands[`${item.brandId}-${item.styleId}`])
        brands[`${item.brandId}-${item.styleId}`] = [];

      brands[`${item.brandId}-${item.styleId}`].push(item);

      return brands;
    }, {})
  );
});

module.exports = router;

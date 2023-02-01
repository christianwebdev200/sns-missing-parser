var express = require("express");
var router = express.Router();
var missingSns = require("../missing-hires-sns.json");
var groupedMissingSns = require("../missing-sns-chunk.json");
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
        if (parts.styleImage === false){ 
          result.md.push(`${productId}-F`)
          result.pd.push(`${productId}-F`)
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

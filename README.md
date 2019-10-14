# Table of Contents
1. [Description](#description)
2. [Flow](#actor-flow)
3. [Options](#options)
4. [Notes](#notes)
4. [Sample Result](#sample-result)



<a name="description"></a>
## Description
An Apify actor that fetches restaurants from aliexpress.com. The actor can start or end between specific pages or category indexes*.

*The actor crawls through all categories and puts them into a list. Category indexes helps you to work between intervals.

<a name="flow"></a>
## Flow
1. Fetches main categories from home page
2. For each category, requests it's subcategories and scrapes their links.
3. For each subcategory, fetches their first page (<i>or start index</i>) and recursively crawl over next pages (<i>until end page</i>)
4. For each subcategory page, fetches the links of products that listed on the page.
5. For each product, fetches the basic data from the page and requests description, recommendations and questions with seperate requests.
6. Pushes data to dataset for each product.

<a name="options"></a>
## Options

* maxConcurrency
	- Manually set the maximum concurrency for Puppeteer instance
	- Not required.
	- Default is `500`
* minConcurrency
 	- Manually set the minimum concurrency for Puppeteer instance
	- Not required.
	- Default is `1`
* country
	- Helps you to set the localization of Aliexpress.
	- Not required.
	- Default is `US`
* startPage
	- Manually set the start page for each category.
	- Not required.
	- Default is `1`
* endPage
	- Manually set the end page for each category.
	- Not required.
	- Default is `null`
* categoryStartIndex
	- Manually set the start index for categories.
	- Not required.
	- Default is `1`
* categoryEndIndex
	- Manually set the end index for categories.
	- Not required.
	- Default is `null`


<a name="notes"></a>
## Notes
Ali Express got several anti-scraping solutions. For the best performance you should run this actor several times with different options.


<a name="sample-result"></a>
## Sample Result
```
{
  "id": 33041186999,
  "link": "https://www.aliexpress.com/item/velvet-thick-denim-jacket-female-winter-big-fur-collar-Korean-locomotive-lamb-coat-female-student-short/33041186999.html?algo_pvid=86d9e3e7-fbf6-401f-adbe-549c7bd8635f&algo_expid=86d9e3e7-fbf6-401f-adbe-549c7bd8635f-1&btsid=0db3f6d8-9c6c-4cdf-99bf-8bcf4ec6b9b4&ws_ab_test=searchweb0_0,searchweb201602_3,searchweb201603_55",
  "title": "velvet thick denim jacket female winter big fur collar Korean locomotive lamb coat female student short coat",
  "tradeAmount": "4543 orders",
  "averageStar": "4.6",
  "store": {
    "followingNumber": 109,
    "establishedAt": "Nov 9, 2018",
    "positiveNum": 105,
    "positiveRate": "96.8%",
    "name": "Insfree Store",
    "id": 4650041,
    "url": "https://www.aliexpress.com/store/4650041",
    "topRatedSeller": false
  },
  "specs": [
    {
      "Brand Name": "MusLotus"
    },
    {
      "Clothing Length": "REGULAR"
    },
    {
      "Decoration": "Fur"
    },
    {
      "Decoration": "None"
    },
    {
      "Model Number": "KEC176"
    },
    {
      "Thickness": "Thick （Winter)"
    },
    {
      "Material": "Polyester"
    },
    {
      "Hooded": "Yes"
    },
    {
      "Closure Type": "Single Breasted"
    },
    {
      "Pattern Type": "Solid"
    },
    {
      "Collar": "None"
    },
    {
      "Sleeve Length(cm)": "Full"
    },
    {
      "Sleeve Style": "REGULAR"
    },
    {
      "Type": "Bat Sleeved"
    },
    {
      "Style": "Casual"
    }
  ],
  "categories": [
    "All Categories",
    "Women's Clothing",
    "Jackets & Coats",
    "Jackets"
  ],
  "wishedCount": 8290,
  "quantity": 4475,
  "photos": [
    "https://ae01.alicdn.com/kf/H12ba5c44fe2f4e81b7266a54b23abc13r/velvet-thick-denim-jacket-female-winter-big-fur-collar-Korean-locomotive-lamb-coat-female-student-short.jpg",
    "https://ae01.alicdn.com/kf/H7901a91f249448d6864889e39eaf0d1bH/velvet-thick-denim-jacket-female-winter-big-fur-collar-Korean-locomotive-lamb-coat-female-student-short.jpg",
    "https://ae01.alicdn.com/kf/H7da27fd118254af6848f80dd34ad39cdE/velvet-thick-denim-jacket-female-winter-big-fur-collar-Korean-locomotive-lamb-coat-female-student-short.jpg",
    "https://ae01.alicdn.com/kf/Hecb9158010d94fbb832dc4879f8c39aeh/velvet-thick-denim-jacket-female-winter-big-fur-collar-Korean-locomotive-lamb-coat-female-student-short.jpg",
    "https://ae01.alicdn.com/kf/H717f70f3a9c643bb99f87899dca971e0P/velvet-thick-denim-jacket-female-winter-big-fur-collar-Korean-locomotive-lamb-coat-female-student-short.jpg",
    "https://ae01.alicdn.com/kf/H4004fe8749a04d99adc975306be50fddc/velvet-thick-denim-jacket-female-winter-big-fur-collar-Korean-locomotive-lamb-coat-female-student-short.jpg"
  ],
  "skuOptions": [
    {
      "name": "Color",
      "values": [
        null,
        null,
        null,
        null
      ]
    },
    {
      "name": "Size",
      "values": [
        null,
        null,
        null,
        null,
        null,
        null
      ]
    }
  ],
  "prices": [
    {
      "price": "US $35",
      "attributes": [
        "Gray",
        "M"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Gray",
        "S"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Pink",
        "S"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Gray",
        "XXL"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Gray",
        "XL"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Gray",
        "L"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "White",
        "XXL"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Gray",
        "XS"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Black",
        "M"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Pink",
        "XS"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Black",
        "S"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "White",
        "XS"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Black",
        "XS"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Pink",
        "XXL"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Pink",
        "XL"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Black",
        "XXL"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Pink",
        "L"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Black",
        "XL"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Pink",
        "M"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "Black",
        "L"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "White",
        "XL"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "White",
        "L"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "White",
        "M"
      ]
    },
    {
      "price": "US $35",
      "attributes": [
        "White",
        "S"
      ]
    }
  ],
  "description": [
    "https://ae01.alicdn.com/kf/Had1aa6bf6304439b8f190596d468e433W.jpg?width=953&height=364&hash=1317",
    "https://ae01.alicdn.com/kf/HTB1s3F2QpYqK1RjSZLeq6zXppXao.jpg?width=700&height=216&hash=916",
    "https://ae01.alicdn.com/kf/HTB1cYxFc9WD3KVjSZSgq6ACxVXaa.jpg?width=800&height=800&hash=1600",
    "https://ae01.alicdn.com/kf/HTB1lv4Hc8Kw3KVjSZFOq6yrDVXaN.jpg?width=800&height=800&hash=1600",
    "https://ae01.alicdn.com/kf/HTB1MUtJc8Cw3KVjSZFuq6AAOpXai.jpg?width=800&height=800&hash=1600",
    "https://ae01.alicdn.com/kf/HTB1Y1dobQxz61VjSZFrq6xeLFXaM.jpg?width=800&height=800&hash=1600",
    "https://ae01.alicdn.com/kf/H204e681a5dff4f29a9527ca6b3beb94fY.jpg?width=640&height=640&hash=1280",
    "https://ae01.alicdn.com/kf/H36edd5a6bc5c4b5cb1707b78e5c3d5f5X.jpg?width=800&height=800&hash=1600",
    "https://ae01.alicdn.com/kf/Hcdb8b8a2806c4e03b2ab51647bf19b62L.jpg?width=750&height=716&hash=1466",
    "https://ae01.alicdn.com/kf/H92126623051242968847c3b63b268ca3L.jpg?width=750&height=953&hash=1703"
  ],
  "overview": "<html><head></head><body><p style=\"color: rgb(51, 51, 51); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;\"><span style=\"font-family: &quot;times new roman&quot;, times, serif; font-size: 48px;\">&#xA0; &#xA0; &#xA0;</span></p>\n\n<p style=\"color: rgb(51, 51, 51); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;\"><span style=\"font-family: &quot;times new roman&quot;, times, serif; font-size: 48px;\">&#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0;</span><span style=\"font-family: &quot;times new roman&quot;, times, serif;\"><span style=\"font-size: 48px;\">Size Chart</span></span><br>\n<br>\n<img src=\"https://ae01.alicdn.com/kf/Had1aa6bf6304439b8f190596d468e433W.jpg?width=953&amp;height=364&amp;hash=1317\"></p>\n\n<p style=\"color: rgb(51, 51, 51); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;\">&#xA0;</p>\n\n<p style=\"color: rgb(51, 51, 51); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;\"><img alt=\"HTB16XcMqY5YBuNjSspoq6zeNFXaJ\" src=\"https://ae01.alicdn.com/kf/HTB1s3F2QpYqK1RjSZLeq6zXppXao.jpg?width=700&amp;height=216&amp;hash=916\" style=\"cursor: default;\"></p>\n\n<p style=\"text-align: left;margin:0;\">&#xA0;</p>\n\n<p style=\"text-align: left;margin:0;\">&#xA0;</p>\n\n<p style=\"text-align: left;margin:0;\">&#xA0;</p>\n\n<p style=\"color: rgb(51, 51, 51); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;\">&#xA0;</p>\n\n<p style=\"color: rgb(51, 51, 51); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;\">&#xA0;</p>\n\n<p style=\"color: rgb(51, 51, 51); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;\">&#xA0;</p>\n\n<p style=\"color: rgb(51, 51, 51); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;\">&#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; <span style=\"font-family: &quot;times new roman&quot;, times, serif; font-size: 48px;\">Product Show</span></p>\n\n<p style=\"color: rgb(51, 51, 51); font-family: Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;\">&#xA0;</p>\n\n<p style=\"text-align: left;margin:0;\"><img src=\"https://ae01.alicdn.com/kf/HTB1cYxFc9WD3KVjSZSgq6ACxVXaa.jpg?width=800&amp;height=800&amp;hash=1600\"><br>\n<img src=\"https://ae01.alicdn.com/kf/HTB1lv4Hc8Kw3KVjSZFOq6yrDVXaN.jpg?width=800&amp;height=800&amp;hash=1600\"><img src=\"https://ae01.alicdn.com/kf/HTB1MUtJc8Cw3KVjSZFuq6AAOpXai.jpg?width=800&amp;height=800&amp;hash=1600\"><img src=\"https://ae01.alicdn.com/kf/HTB1Y1dobQxz61VjSZFrq6xeLFXaM.jpg?width=800&amp;height=800&amp;hash=1600\"><br>\n<img src=\"https://ae01.alicdn.com/kf/H204e681a5dff4f29a9527ca6b3beb94fY.jpg?width=640&amp;height=640&amp;hash=1280\"><img src=\"https://ae01.alicdn.com/kf/H36edd5a6bc5c4b5cb1707b78e5c3d5f5X.jpg?width=800&amp;height=800&amp;hash=1600\"><br>\n<br>\n<img src=\"https://ae01.alicdn.com/kf/Hcdb8b8a2806c4e03b2ab51647bf19b62L.jpg?width=750&amp;height=716&amp;hash=1466\"><img src=\"https://ae01.alicdn.com/kf/H92126623051242968847c3b63b268ca3L.jpg?width=750&amp;height=953&amp;hash=1703\"></p>\n\n<script>window.adminAccountId=234712787;</script>\n</body></html>",
  "feedbacks": [
    {
      "user": {
        "name": "",
        "country": "US"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:M",
        "Logistics: e邮宝"
      ],
      "date": "18 Sep 2019 15:08",
      "review": "Beautiful jacket. Fast service. Thank you very much",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "L***u",
        "country": "RO"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:XXL",
        "Logistics: 中国邮政挂号小包"
      ],
      "date": "10 Oct 2019 08:21",
      "review": "is very beautiful came very quickly I recommend this seller along with his store",
      "photos": [
        "https://ae01.alicdn.com/kf/U002c10ffebb24dcfb23ca5d21b9729c2J.jpg",
        "https://ae01.alicdn.com/kf/U181358bab4224a1e901efab7f30972e6w.jpg",
        "https://ae01.alicdn.com/kf/U71b28c1465df4b59806752224fcda9b10.jpg"
      ],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "M***m",
        "country": "RU"
      },
      "rating": 5,
      "specs": [
        "Color:Black",
        "Size:S",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "09 Oct 2019 17:46",
      "review": "With the seller did not communicate, the denim jacket with a good lining., bought for 2 381,47 s-size, 46,48",
      "photos": [
        "https://ae01.alicdn.com/kf/Uacfa9e66a21b430e931e9ac934eb47c0Y.jpg",
        "https://ae01.alicdn.com/kf/Uab40cabb0db04e84835dbe35825902a92.jpg",
        "https://ae01.alicdn.com/kf/Uf4bf96fe54944cf1a8048e8bfa3af0a61.jpg"
      ],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "",
        "country": "DE"
      },
      "rating": 5,
      "specs": [
        "Color:Black",
        "Size:M",
        "Logistics: CNE"
      ],
      "date": "12 Oct 2019 09:49",
      "review": "Very good, heavy Jacket. Very comfortable and well crafted.",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "A***a",
        "country": "RU"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:M",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "09 Oct 2019 14:23",
      "review": "The jacket really liked, beautiful fashionable, sat perfectly. I ordered m on xs. Looks like i wanted.",
      "photos": [
        "https://ae01.alicdn.com/kf/Uf553860318f24e26b2e71e118339557aq.jpg"
      ],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "B***b",
        "country": "FR"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:S",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "12 Oct 2019 07:19",
      "review": "Super. Happy with the purchase",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "L***o",
        "country": "FR"
      },
      "rating": 4,
      "specs": [
        "Color:Gray",
        "Size:XXL",
        "Logistics: AliExpress Standard Shipping"
      ],
      "date": "03 Sep 2019 04:3728 Sep 2019 00:01",
      "review": "I did not expect this quality, great :) I removed a star because they sent me the wrong color.",
      "photos": [
        "https://ae01.alicdn.com/kf/Ufe013edfbf114d87af3dc7827294f8818.jpg",
        "https://ae01.alicdn.com/kf/U6fc6954a3f3b477b8730b5dce4b2100db.jpg"
      ],
      "additionalFeedback": {
        "text": "Non-professional seller who does not answer any email!!!",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "P***f",
        "country": "PL"
      },
      "rating": 5,
      "specs": [
        "Color:Black",
        "Size:XL",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "01 Oct 2019 08:17",
      "review": "Fast shipping, jacket compatible with description, daughter has size M, zamówiłam XL fits perfectly",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "",
        "country": "ES"
      },
      "rating": 5,
      "specs": [
        "Color:Pink",
        "Size:XXL",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "20 Sep 2019 02:38",
      "review": "Very warm and beautiful. Same as description!",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "S***a",
        "country": "BE"
      },
      "rating": 3,
      "specs": [
        "Color:Gray",
        "Size:XXL",
        "Logistics: CNE"
      ],
      "date": "20 Sep 2019 00:51",
      "review": "Strange the sewing collar is not sewn and no button available to hang the collar ....",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "M***g",
        "country": "ES"
      },
      "rating": 3,
      "specs": [
        "Color:Gray",
        "Size:XS",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "07 Oct 2019 12:49",
      "review": "Even a size xs is quite large, but very good quality",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "F***e",
        "country": "IT"
      },
      "rating": 3,
      "specs": [
        "Color:Gray",
        "Size:S",
        "Logistics: CNE"
      ],
      "date": "11 Sep 2019 22:59",
      "review": "Excellent quality and is really heavy. Pity the S i is as if it were a L.",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "S***n",
        "country": "US"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:M",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "11 Oct 2019 02:22",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "",
        "country": "US"
      },
      "rating": 4,
      "specs": [
        "Color:Gray",
        "Size:XXL",
        "Logistics: China Post Registered Air Mail"
      ],
      "date": "20 Sep 2019 01:49",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "E***a",
        "country": "US"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:S",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "09 Sep 2019 04:20",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "M***i",
        "country": "IT"
      },
      "rating": 4,
      "specs": [
        "Color:Gray",
        "Size:L",
        "Logistics: CNE"
      ],
      "date": "30 Sep 2019 05:5130 Sep 2019 05:52",
      "review": "",
      "photos": [
        "https://ae01.alicdn.com/kf/U4a597ba7d5064fd0b44b19d18c8e441fu.jpg",
        "https://ae01.alicdn.com/kf/Uffdca3b5679c4005b0a9da47aa7d1653N.jpg",
        "https://ae01.alicdn.com/kf/Uf482da0297af4825b15c649c3c7e9cdcc.jpg"
      ],
      "additionalFeedback": {
        "text": "Bello \n",
        "photos": [
          "https://ae01.alicdn.com/kf/U43af4b4e3b0b4b62b61a15049631d29aj.jpg",
          "https://ae01.alicdn.com/kf/U9c8c545f576e49979aac63e1b2614fa01.jpg",
          "https://ae01.alicdn.com/kf/U8227dadce3fd4ab0a407f17feb912afb4.jpg"
        ]
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "D***t",
        "country": "FR"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:XXL",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "08 Oct 2019 07:12",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "E***e",
        "country": "PT"
      },
      "rating": 5,
      "specs": [
        "Color:Pink",
        "Size:S",
        "Logistics: e邮宝"
      ],
      "date": "09 Oct 2019 12:23",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "L***e",
        "country": "FR"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:XXL",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "14 Sep 2019 03:51",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "L***a",
        "country": "RU"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:XXL",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "08 Oct 2019 11:09",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "",
        "country": "PL"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:XS",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "08 Oct 2019 10:18",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "",
        "country": "FR"
      },
      "rating": 4,
      "specs": [
        "Color:Gray",
        "Size:XS",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "23 Sep 2019 09:13",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "",
        "country": "BE"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:S",
        "Logistics: CNE"
      ],
      "date": "24 Sep 2019 10:35",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "F***r",
        "country": "PL"
      },
      "rating": 4,
      "specs": [
        "Color:Black",
        "Size:XS",
        "Logistics: AliExpress 无忧物流-标准"
      ],
      "date": "03 Oct 2019 10:56",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    },
    {
      "user": {
        "name": "",
        "country": "IL"
      },
      "rating": 5,
      "specs": [
        "Color:Gray",
        "Size:S",
        "Logistics: ePacket"
      ],
      "date": "20 Aug 2019 08:25",
      "review": "",
      "photos": [],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    }
  ],
  "feedbackSummary": [
    {
      "attribute": "5 Stars",
      "value": "69%"
    },
    {
      "attribute": "4 Stars",
      "value": "19%"
    },
    {
      "attribute": "3 Stars",
      "value": "12%"
    },
    {
      "attribute": "2 Stars",
      "value": "0%"
    },
    {
      "attribute": "1 Star",
      "value": "0%"
    }
  ],
  "questions": [
    {
      "alsoAsk": 0,
      "answers": [],
      "cnty": "PL",
      "content": "Is the black coloured jacket really available? ",
      "contentLang": "en",
      "gmtCreate": 1570720805000,
      "id": 400017444221,
      "lang": "pl",
      "owner": 915168083,
      "serialNumber": 400008012062,
      "targetId": 33041186999,
      "totalAnswer": 0,
      "totalAsk": 1,
      "translateContent": ""
    }
  ]
}
```

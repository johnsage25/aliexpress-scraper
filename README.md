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
* liveView
	- Enables live view option on Apify platform
	- Not required.
	- Default is `false`
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
  "id": 32927493161,
  "title": "Korean Streetwear Fashion Plaid Block Slim Ankle Pant Summer Thin Pocket Trouser Student Ulzzang Elegant Casual Japanese Bottom",
  "tradeAmount": "4 orders",
  "averageStar": "4.4",
  "store": {
    "followingNumber": 1121,
    "establishedAt": "Feb 10, 2018",
    "positiveNum": 588,
    "positiveRate": "92.7%",
    "name": "Shop3617085 Store",
    "id": 3617085,
    "url": "https://www.aliexpress.com/store/3617085",
    "topRatedSeller": false
  },
  "specs": [
    {
      "Brand Name": "YrightMwrong"
    },
    {
      "Length": "Ankle-Length Pants"
    },
    {
      "Material": "COTTON"
    }
  ],
  "categories": [
    "All Categories",
    "Women's Clothing",
    "Bottoms",
    "Pants & Capris"
  ],
  "wishedCount": 13726,
  "quantity": 17221,
  "photos": [
    "https://ae01.alicdn.com/kf/H0c3b25da782d4143be18e7e66cb19b90E/Korean-Streetwear-Fashion-Plaid-Block-Slim-Ankle-Pant-Summer-Thin-Pocket-Trouser-Student-Ulzzang-Elegant-Casual.jpg",
    "https://ae01.alicdn.com/kf/Hced0ca9e5d1e4f96ab324143e48064c40/Korean-Streetwear-Fashion-Plaid-Block-Slim-Ankle-Pant-Summer-Thin-Pocket-Trouser-Student-Ulzzang-Elegant-Casual.jpg",
  ],
  "skuOptions": [
    {
      "name": "Color",
      "values": [
        "black white plaid",
        "black red plaid",
        "White black block",
        "red black block",
        "white black plaid"
      ]
    },
    {
      "name": "Size",
      "values": [
        "M",
        "L"
      ]
    }
  ],
  "prices": [
    {
      "price": "US $12.45",
      "attributes": [
        "Blue",
        "M"
      ]
    },
    {
      "price": "US $12.45",
      "attributes": [
        "Blue",
        "L"
      ]
    },
  ],
  "description": "<h2 style=\"margin-top:0px;margin-bottom:0px;font-size:12px;color:rgb(0, 0, 0);text-align:center;\">&nbsp;</h2>\n\n<h2 style=\"margin-top:0px;margin-bottom:0px;font-size:12px;color:rgb(0, 0, 0);text-align:center;\"><img align=\"absmiddle\" src=\"https://ae01.alicdn.com/kf/HTB1r_uVXdzvK1RkSnfoq6zMwVXao.jpg?width=800&amp;height=800&amp;hash=1600\">\n",
  "feedbacks": [{
      "user": {
        "name": "A***Y",
        "country": "BY"
      },
      "rating": 4,
      "specs": [
        "Color:Beige",
        "Size:M",
        "Logistics: China Post Registered Air Mail"
      ],
      "date": "18 Jul 2019 13:01",
      "review": "Pants are good, but had to suture. They were wide.",
      "photos": [
        "https://ae01.alicdn.com/kf/UTB8ydudQwQydeJk43PUq6AyQpXa9.jpg"
      ],
      "additionalFeedback": {
        "text": "",
        "photos": []
      },
      "sellerReply": ""
    }
  ],
  "questions": [
    alsoAsk: 0,
    answers: [ {
          "cnty": "UK",
          "content": "U3 sd card : or records great on 5g version via WiFi to iPhone ",
          "contentLang": "",
          "gmtCreate": 1568844573000,
          "id": 1000000187905,
          "lang": "en",
          "owner": 1653610370,
          "refId": 400017196172,
          "serialNumber": 400007593710,
          "targetId": 4000016604997,
          "translateContent": ""
    }],
    cnty: 'BR',
    content: 'para 13kg qual o tamanho?',
    contentLang: 'pt',
    gmtCreate: 1543432819000,
    id: 600002872841,
    lang: 'pt',
    owner: 873705924,
    serialNumber: 600001006784,
    targetId: 32627257556,
    totalAnswer: 3,
    totalAsk: 21,
    translateContent: 'For 13 kg which the size?' },
  ]
}

```

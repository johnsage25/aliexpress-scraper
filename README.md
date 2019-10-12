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


```

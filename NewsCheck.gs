function getMultiNewsToDiscord() {
  // 1. 検索したいキーワードをリストにする
  const keywords = ["自動化 GAS", "生成AI ニュース", "Discord 活用", "Python 初心者"]; // ここに欲しい情報のキーワードを入力
  
  const webhookUrl = "YOUR_DISCORD_WEBHOOK_URL_HERE"; // ここにWebhookのURL
  
  keywords.forEach((keyword, index) => {
    // 2. GoogleニュースのRSSを取得
    const rssUrl = "https://news.google.com/rss/search?q=" + encodeURIComponent(keyword) + "&hl=ja&gl=JP&ceid=JP:ja";
    const response = UrlFetchApp.fetch(rssUrl);
    const xml = XmlService.parse(response.getContentText());
    const items = xml.getRootElement().getChild("channel").getChildren("item");

    // 各キーワードにつき最新の1件だけ取得（欲張ると通知が鳴り止まないので）
    if (items.length > 0) {
      const title = items[0].getChildText("title");
      const link = items[0].getChildText("link");

      const message = {
        "embeds": [{ // Embed（埋め込み）形式にすると見た目がカッコよくなります
          "title": `🔍 ニュース: ${keyword}`,
          "description": title,
          "url": link,
          "color": 3447003 // 青色
        }]
      };

      // 3. Discordへ送信
      UrlFetchApp.fetch(webhookUrl, {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(message)
      });
      
      // 連続投稿でエラーにならないよう、1秒待機
      Utilities.sleep(1000);
    }
  });
}
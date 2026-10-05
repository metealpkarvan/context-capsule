# Context Capsule

AI sohbetleri arasında taşınabilen, düzenlenebilir bağlam kartları.

**[Uygulamayı aç](https://metealpkarvan.github.io/context-capsule/)** · [English](README.md) · [İndirilebilir ZIP](https://github.com/metealpkarvan/context-capsule/releases/latest)

![Context Capsule ekran görüntüsü](docs/preview.png)

## Nasıl kullanılır?

1. Proje adını, hedefini ve yeni sohbetin ilk adımını yaz.
2. Bilgi, karar, iş ve soru kartları ekle; mutlaka taşınacakları sabitle.
3. Mevcut notları her satıra bir bilgi olacak şekilde taslak kartlara ayır. Taslaklar seçili başlamaz; inceleyip seç.
4. Karakter bütçesini belirle. Sabit bilgiler sığmazsa bütçeyi artır; içerik sessizce kesilmez.
5. Markdown paketi kopyala/indir; düzenlenebilir kartlar için JSON yedeği kullan.

EN/TR düğmesi dili değiştirir. Örnek düğmesi kurgusal veriler yükler. İlk başarılı çevrimiçi açılıştan sonra uygulama dosyaları aynı tarayıcıda çevrimdışı kullanım için önbelleğe alınır.

## İndir ve yerelde çalıştır

Canlı demo için hesap veya kurulum gerekmez. Releases bölümündeki **context-capsule-v1.0.0.zip** dosyasını indir, çıkar ve çıkarılan klasörde çalıştır:

    python3 -m http.server 8080 --bind 127.0.0.1

Tarayıcıda http://127.0.0.1:8080 adresini aç. Modül kısıtlamaları nedeniyle HTML dosyasına çift tıklamak yerine yerel HTTP sunucusu kullanılır. ZIP, kullanıcı kayıtlarını içermez.

## Gizlilik ve sınırlar

Uygulama cihazında çalışır. AI API anahtarı, sunucuya metin yükleme, reklam, analiz veya hesap gerektirmez. Kayıtlar bu tarayıcının yerel deposundadır. JSON yedekleri şifresizdir; önemli kayıtlar için yedek indir. İçe aktarma mevcut kayıtları değiştirmeden önce doğrulama ve onay ister.

Bütçe model tokenı değil Unicode karakter sayısıdır. Araç sohbet geçmişine bağlanmaz, otomatik AI özeti üretmez ve başka modelin pakete uyacağını garanti etmez.

## Araştırma ve geliştirme

Dayanılan paylaşım: [Cline](https://x.com/cline/status/1922846215894597996) (2025-05-15). X erişim sınırlaması nedeniyle [okunabilir thread kopyası](https://threadreaderapp.com/thread/1922846215894597996) da incelendi. Bu seçilmiş küçük bir keşif örneklemidir; pazar araştırması veya ölçülmüş başarı iddiası değildir. Gözlem ile ürün çıkarımı [araştırma notlarında](docs/RESEARCH.md) ayrılır.

Geliştirme için Node.js 22+ gerekir:

    npm test
    npm run build

Testler, mimari tercihler ve kullanım kontrolleri İngilizce teknik belgelerde açıklanır. MIT lisansıyla kullanabilir, değiştirebilir ve katkıda bulunabilirsin.

<template>
  <!DOCTYPE html>
  <html lang="de_DE">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{props.title}}</title>
    <!-- <style>
      @media screen and (max-width: 550px) {
        .wrapper {
          padding: 0;
          border-spacing: 0 !important;
          border-collapse: separate;
        }

        .wrapper > tbody > tr > td {
          padding: 0;
          box-shadow: 0 10px 50px rgba(0,0,0,.1);
        }

        .wrapper table {
          width: 100% !important;
          max-width: 100% !important;
        }

        .fix-pad > tbody > tr > td {
          padding: 30px;
        }
      }

      .header {
        border-radius: 5px 5px 0 0;
      }

      .footer {
        border-radius: 0 0 5px 5px;
      }

      .main-content {
        padding: 50px 0;
      }

    </style> -->
  </head>
  <body style="background-color: #F8F8F8;">


    <table class="wrapper" cellpadding="50" cellspacing="0" align="center">
      <tr>
        <td>

          <!-- HEADER -->
          <table class="wrapper-inner header" width="640" style="width: 640px; background-color: #EBEBEB;" cellpadding="30" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="{{props.home_url}}">
                    <img src="/imgs/KarriereKind-Logo.png" alt="Karrierekind Logo – Klick führt auf unsere Website / Portal" width="200" style="width: 200px;">
                  </a>
                </td>
              </tr>
          </table>

          <!-- MAIN CONTENT -->
          <table class="main-content fix-pad" cellpadding="50" cellspacing="0" style="background-color: #FFFFFF;" width="640">
            <tr>
              <td align="center">
                <img src="/imgs/checkicon.png" alt="Checkicon in einem Kreis" width="50" style="margin-bottom: 10px">
                <p style="font-family: Open Sans, helvetica, arial, sans-serif; text-align: center; color: #2A2A2A; line-height: 24px; font-size: 16px;">
                  <!-- Vielen Dank für Deine Anmeldung, <br><br>
                  wir haben Deine Einstellungen gespeichert. Jetzt liegt es an Dir, Dein Konto zu vervollständigen. Klicke auf den Link unten und fülle die fehlenden Informationen aus und schon steht Deinem Traumjob nichts mehr im Weg. <br><br> -->
                  {{props.message}}
                  <br><br>
                </p>

                <!-- BUTTON -->
                <table border="0" cellspacing="0" cellpadding="0" v-if="props.button_text">
                  <tr>
                    <td style="padding: 12px 18px 12px 18px; border-radius:0px; background-color: #209DCB;" align="center">
                      <a href="{{props.button_link}}" target="_blank" style="font-size: 18px; font-family: Open Sans, helvetica, arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block;">
                        {{props.button_text}}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- FOOTER -->
          <table class="fix-width footer" width="640" cellpadding="30" cellspacing="0" style="background: #2A2A2A;">
            <tr>
              <td>
                <p style="font-family: Open Sans, helvetica, arial, sans-serif; text-align: center; color: #FFFFFF; line-height: 20px; font-size: 12px;">
                  <b>KarriereKind GmbH</b><br>
                  Berliner Allee 51-53<br>
                  40212 Düsseldorf<br><br>

                  Registernummer: HRB 99139 <br>
                  Amtsgericht: 40227 Düsseldorf <br><br>
                  

                  Tel.: <a href="tel:{{props.phonenumber}}" style="color: #FFFFFF; font-family: Open Sans, helvetica, arial, sans-serif; text-decoration: none;">Tel.: {{props.phonenumber}}</a> <br>
                  <a href="mailto:{{props.email_address}}" style="color: #FFFFFF; font-family: Open Sans, helvetica, arial, sans-serif; text-decoration: none;">{{props.email_address}}</a>

                  <br><br>
                  <a href="{{props.home_url}}/impressum" style="color: #FFFFFF; font-family: Open Sans, helvetica, arial, sans-serif; text-decoration: none;">Impressum</a> | <a href="{{props.home_url}}/datenschutz" style="color: #FFFFFF; font-family: Open Sans, helvetica, arial, sans-serif; text-decoration: none;">Datenschutz</a>
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>


  </body>
  </html>
</template>



<script setup>
  const props = defineProps({
    title: {
      type: String,
      required: false,
      default: "We recieved your request"
    },
    home_url: {
      type: String, 
      required: false,
      default: '/'
    },
    phonenumber: {
      type: String, 
      required: false,
      default: '017767589321'
    },
    email_address: {
      type: String, 
      required: false,
      default: 'info@karrierekind.de'
    },
    message: {
      type: String, 
      required: true
    },
    button_text: {
      type: String, 
      required: false,
      default: null
    },
    button_link: {
      type: String, 
      required: false,
      default: null
    },
    
  })
</script>



<style lang="scss" scoped>

  @media screen and (max-width: 550px) {
    .wrapper {
      padding: 0;
      border-spacing: 0 !important;
      border-collapse: separate;
    }

    .wrapper > tbody > tr > td {
      padding: 0;
      box-shadow: 0 10px 50px rgba(0,0,0,.1);
    }

    .wrapper table {
      width: 100% !important;
      max-width: 100% !important;
    }

    .fix-pad > tbody > tr > td {
      padding: 30px;
    }
  }

  .header {
    border-radius: 5px 5px 0 0;
  }

  .footer {
    border-radius: 0 0 5px 5px;
  }

  .main-content {
    padding: 50px 0;
  }

</style>
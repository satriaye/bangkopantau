async function searchGoogleSheets() {
      Swal.fire({
        title: "Yakin sudah benar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Ok!",
            text: "",
            icon: "success"
          });

        }
      });

      const searchTerm = $("#search").val().toUpperCase();
      const nomorValue = $("#nomor").val();
      const daerahValue = $("#daerah").val();

      // Validasi input
      if (!searchTerm.trim()) {
        $("#search").addClass("error-border");

        return;
      } else {
        $("#search").removeClass("error-border");

      }

      if (!nomorValue.trim()) {
        $("#nomor").addClass("error-border");

        return;
      } else {
        $("#nomor").removeClass("error-border");

      }

      if (!daerahValue.trim()) {
        $("#daerah").addClass("error-border");

        return;
      } else {
        $("#daerah").removeClass("error-border");

      }

      // Periksa apakah searchTerm atau nomor kosong
      if (!searchTerm.trim() || !nomorValue.trim() || !daerahValue.trim()) {
        $("#searchResult").html("Belum sepenuhnya terisi");
        return;
      }


      const responseSheet3 = await $.post("/search", {
        searchTerm,
        nomor: nomorValue,
        daerah: daerahValue,
        sheet: "DATABASE-TL!B1:CZ1000",
      });


      if (responseSheet3 === "No matching values found.") {
        $("#searchResult").html("Permohonan anda belum ada di database tim pemeriksa.");
displayImages("Permohonan anda belum ada di database tim pemeriksa.");
      } else {

        const resultArraySheet3 = responseSheet3.split(",");

     
        if (resultArraySheet3.length >= 3 && resultArraySheet3[2].trim() === nomorValue.trim() && resultArraySheet3[3].trim() === daerahValue.trim()
        ) { 
          const output = processSearchResult(resultArraySheet3);
          $("#searchResult").html(output);
        } else {
          $("#searchResult").html("Permohonan anda belum ada di database tim pemeriksa.");

        }
      }
    }


    function processSearchResult(resultArray) {
      let output = "Kosong";
      let additionalInfo = "";

      if (resultArray[0] && resultArray[0].trim() !== "" && !resultArray[25] && !resultArray[27] ) {
        output = `Halo, <span style="color: #1a3cad;">${resultArray[0]}</span>`;
        additionalInfo =
          "Permohonan anda sudah diterima tim pemeriksa. Akan segera kami proses ya!"; 
      } else if (resultArray[0] && resultArray[0].trim() !== "" && resultArray[25] && !resultArray[27]) {
        output = `Halo, <span style="color: #1a3cad;">${resultArray[0]}</span>`;
        additionalInfo =
          "Telah kami terbitkan Surat Perintah Pemeriksaan (SP2). Permohonan Anda sebentar lagi akan selesai! Anda akan kami hubungi untuk pemeriksaan lebih lanjut."; 
      } else if (resultArray[0] && resultArray[0].trim() !== "" && resultArray[25] && resultArray[27]) {
        output = `Halo, <span style="color: #1a3cad;">${resultArray[0]}</span>`; 
        additionalInfo =
          "Permohonan anda telah kami selesaikan. Silahkan tunggu, kami akan kirimkan surat keputusannya ke alamat anda.";
      }

      displayImages(additionalInfo);
      $("#progressbar").remove();
      displayProgressbar(additionalInfo);
      return `${output}<br>${additionalInfo}`;
    }





   
    function displayImages(result) {
      const imageContainer = $("#imageContainer");

      switch (result.trim()) {
        case "Permohonan anda belum ada di database tim pemeriksa.":
          imageContainer.html('<img src="aset/song.png" alt="logo" style="width:200px; height:200px;">');
          break;
        case "Permohonan anda sudah diterima tim pemeriksa. Akan segera kami proses ya!":
          imageContainer.html('<img src="aset/np2atauinputdoang.png" alt="logo" style="width:200px; height:200px;">');
          break;
        case "Telah kami terbitkan Surat Perintah Pemeriksaan (SP2). Permohonan Anda sebentar lagi akan selesai! Anda akan kami hubungi untuk pemeriksaan lebih lanjut.":
          imageContainer.html('<img src="aset/sp2.png" alt="logo" style="width:200px; height:200px;">');
          break;
        case "Permohonan anda telah kami selesaikan. Silahkan tunggu, kami akan kirimkan surat keputusannya ke alamat anda.":
          imageContainer.html('<img src="aset/selesai.png" alt="logo" style="width:200px; height:200px;">');

          break;
        default:
          imageContainer.html(''); 
          break;
      }
    }



  
    function displayProgressbar(result) {
      const progressbarContainer = $(".progress-bar-wrapper");

      
      progressbarContainer.children().remove();

      switch (result) {
        case "Permohonan anda sudah diterima tim pemeriksa. Akan segera kami proses ya!":
          ProgressBar.singleStepAnimation = 1500;
          ProgressBar.init(
            [
              "Permohonan diproses tim pemeriksa",
              "Telah terbit SP2",
              "Permohonan sudah diselesaikan",
            ],
            "Permohonan diproses tim pemeriksa",
            "progress-bar-wrapper"
          );
          break;
        case "Telah kami terbitkan Surat Perintah Pemeriksaan (SP2). Permohonan Anda sebentar lagi akan selesai! Anda akan kami hubungi untuk pemeriksaan lebih lanjut.":
          ProgressBar.singleStepAnimation = 1500;
          ProgressBar.init(
            [
              "Permohonan diproses tim pemeriksa",
              "Telah terbit SP2",
              "Permohonan sudah diselesaikan",
            ],
            "Telah terbit SP2",
            "progress-bar-wrapper"
          );
          break;
        case "Permohonan anda telah kami selesaikan. Silahkan tunggu, kami akan kirimkan surat keputusannya ke alamat anda.":
          // Set the ProgressBar configuration
          ProgressBar.singleStepAnimation = 1500;
          ProgressBar.init(
            [
              "Permohonan diproses tim pemeriksa",
              "Telah terbit SP2",
              "Permohonan sudah diselesaikan",
            ],
            "Permohonan sudah diselesaikan",
            "progress-bar-wrapper"
          );
          break;
        default:
          break;
      }
    }




    //A wrapper to encapsulate all the code
    (function (window) {
      function initProgressBar() {
        var ProgressBar = {};
        ProgressBar.singleStepAnimation = 1000; //default value
        // this delay is required as browser will need some time in rendering and then processing css animations.
        var renderingWaitDelay = 200;

     
        var createElement = function (type, className, style, text) {
          var elem = document.createElement(type);
          elem.className = className;
          for (var prop in style) {
            elem.style[prop] = style[prop];
          }
          elem.innerHTML = text;
          return elem;
        };

        var createStatusBar = function (stages, stageWidth, currentStageIndex) {
          var statusBar = createElement('div', 'status-bar', {
            width: 100 - stageWidth + '%'
          }, '');
          var currentStatus = createElement('div', 'current-status', {}, '');

          setTimeout(function () {
            currentStatus.style.width = (100 * currentStageIndex) / (stages.length - 1) + '%';
            currentStatus.style.transition = 'width ' + (currentStageIndex * ProgressBar.singleStepAnimation) +
              'ms linear';
          }, renderingWaitDelay);

          statusBar.appendChild(currentStatus);
          return statusBar;
        };

        var createCheckPoints = function (stages, stageWidth, currentStageIndex) {
          var ul = createElement('ul', 'progress-bar', {}, '');
          var animationDelay = renderingWaitDelay;
          for (var index = 0; index < stages.length; index++) {
            var li = createElement('li', 'section', {
              width: stageWidth + '%'
            }, stages[index]);
            if (currentStageIndex >= index) {
              setTimeout(function (li, currentStageIndex, index) {
                li.className += (currentStageIndex > index) ? ' visited' : ' visited current';
              }, animationDelay, li, currentStageIndex, index);
              animationDelay += ProgressBar.singleStepAnimation;
            }
            ul.appendChild(li);
          }
          return ul;
        };

        var createHTML = function (wrapper, stages, currentStage) {
          var stageWidth = 100 / stages.length;
          var currentStageIndex = stages.indexOf(currentStage);

          //create status bar
          var statusBar = createStatusBar(stages, stageWidth, currentStageIndex);
          wrapper.appendChild(statusBar);

          //create checkpoints
          var checkpoints = createCheckPoints(stages, stageWidth, currentStageIndex);
          wrapper.appendChild(checkpoints);

          return wrapper;
        };

        var validateParameters = function (stages, currentStage, container) {
          if (!(typeof stages === 'object' && stages.length && typeof stages[0] === 'string')) {
            console.error('Expecting Array of strings for "stages" parameter.');
            return false;
          }
          if (typeof currentStage !== 'string') {
            console.error('Expecting string for "current stage" parameter.');
            return false;
          }
          if (typeof container !== 'string' && typeof container !== 'undefined') {
            console.error('Expecting string for "container" parameter.');
            return false;
          }
          return true;
        };

        //exposing this function to user;
        ProgressBar.init = function (stages, currentStage, container) {
          if (validateParameters(stages, currentStage, container)) {
            var wrapper = document.getElementsByClassName(container);
            if (wrapper.length > 0) {
              wrapper = wrapper[0];
            } else {
              wrapper = createElement('div', 'progressbar-wrapper', {}, '');
              document.body.appendChild(wrapper);
            }
            createHTML(wrapper, stages, currentStage);
          }
        };
        return ProgressBar;
      }

      if (typeof ProgressBar === 'undefined') {
        window.ProgressBar = initProgressBar();
      } else {
        console.log('Progress bar loaded');
      }

    })(window);

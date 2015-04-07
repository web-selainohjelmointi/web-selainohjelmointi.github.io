var exerciseCounter = 0;


var Material = (function(){
  var self = {};

  self.createContentList = function(){
    var indices = [];
    var data = { headings: [] };
    var primaryHeadingIndex = -1;

    $('.week h2,h3,h4,h5,h6').each(function(i,e) {
      if ($(this).parent('div').hasClass('tehtavat') || $(this).hasClass('ignore')) {
        return;
      }
      
      var hIndex = parseInt(this.nodeName.substring(1)) - 2;

      if (indices.length - 1 > hIndex) {
        indices= indices.slice(0, hIndex + 1 );
      }

      if (indices[hIndex] == undefined) {
        indices[hIndex] = 0;
      }

      indices[hIndex]++;

      var anchorText = (indices.join(".") + '-' + $(this).text()).replace(/ /g,'-')
      $(this).prepend('<a name="' + anchorText + '"></a>' + indices.join(".") + ". ");

      if(hIndex == 0){
        data.headings.push({
          title: $(this).text(),
          anchor: '#' + anchorText
        });

        primaryHeadingIndex++;
      }else if(hIndex == 1){
        if(!data.headings[primaryHeadingIndex].subHeadings){
          data.headings[primaryHeadingIndex].subHeadings = [];
        }

        data.headings[primaryHeadingIndex].subHeadings.push({
          title: $(this).text(),
          anchor: '#' + anchorText
        });
      }
    });

    var template = '<ul>{{#headings}}<li><a href="{{anchor}}">{{title}}</a><ul>{{#subHeadings}}<li><a href="{{anchor}}">{{title}}</a></li>{{/subHeadings}}</ul></li>{{/headings}}</ul>';
    $('#materiaali-sisalto').html(Mustache.render(template, data));
  }

  self.createExerciseList = function(){

    var data = { exercises: [] };
    
    $('section.week').each(function(){
      var weekId = $(this).find('header h1').attr('data-week-id');
      $(this).find('.tehtavat h3:not(.ignore)').each(function(index){
        exerciseCounter++;
        exerciseId = exerciseCounter;

        data.exercises.push({
          title: 'Viikko ' + weekId + ', Tehtävä ' + exerciseId + ': ' +  $(this).text(),
          anchor: '#vk-' + weekId + '-t' + exerciseId
        });

//        $(this).prepend('<a name="vk-' + weekId + '-t' + exerciseId + '"></a>Viikko ' + weekId + ', Tehtävä ' + (index+1) + ': ');
        $(this).prepend('<a name="vk-' + weekId + '-t' + exerciseId + '"></a>Viikko ' + weekId + ', Tehtävä ' + exerciseId + ': ');
      });
    });

    var template = '<ul>{{#exercises}}<li><a href="{{anchor}}">{{title}}</a></li>{{/exercises}}</ul>';
    $('#tehtava-sisalto').html(Mustache.render(template, data));
  }

  return self;
})();

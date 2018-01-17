jQuery(document).ready(function($) {


    /*======= Skillset *=======*/
    
    $('.level-bar-inner').css('width', '0');
    
    $(window).on('load', function() {

        $('.level-bar-inner').each(function() {
        
            var itemWidth = $(this).data('level');
            
            $(this).animate({
                width: itemWidth
            }, 800);
            
        });

    });
    
    /* Bootstrap Tooltip for Skillset */
    $('.level-label').tooltip();
    
    
    /* jQuery RSS - https://github.com/sdepold/jquery-rss */
    
    $("#rss-feeds").rss(
    
        //Change this to your own rss feeds
        "http://feeds.feedburner.com/TechCrunch/startups",
        
        {
        // how many entries do you want?
        // default: 4
        // valid values: any integer
        limit: 3,
        
        // the effect, which is used to let the entries appear
        // default: 'show'
        // valid values: 'show', 'slide', 'slideFast', 'slideSynced', 'slideFastSynced'
        effect: 'slideFastSynced',
        
        // outer template for the html transformation
        // default: "<ul>{entries}</ul>"
        // valid values: any string
        layoutTemplate: "<div class='item'>{entries}</div>",
        
        // inner template for each entry
        // default: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>'
        // valid values: any string
        entryTemplate: '<h3 class="title"><a href="{url}" target="_blank">{title}</a></h3><div><p>{shortBodyPlain}</p><a class="more-link" href="{url}" target="_blank"><i class="fa fa-external-link"></i>Read more</a></div>'
        
        }
    );
    
    /* Github Calendar - https://github.com/IonicaBizau/github-calendar */
/*    GitHubCalendar("#github-graph", "IonicaBizau");
    */
    
    /* Github Activity Feed - https://github.com/caseyscarborough/github-activity */
    GitHubActivity.feed({ username: "caseyscarborough", selector: "#ghfeed" });


	
		var color = '#75A5B7';
	var maxParticles = 80;
	
	particlesJS.load('particles-js', 
		{
			'particles': {
				'number': {
				  'value': maxParticles,
				  'density': {
					'enable': true,
					'value_area': (maxParticles * 10) * 2
				  }
				},
				'color': {
				  'value': color
				},
				'shape': {
				  'type': 'circle',
				  'stroke': {
					'width': 0,
					'color': '#000000'
				  },
				  'polygon': {
					'nb_sides': 5
				  },
				},
				'opacity': {
				  'value': 0.5,
				  'random': false,
				  'anim': {
					'enable': false,
					'speed': 1,
					'opacity_min': 0.1,
					'sync': false
				  }
				},
				'size': {
				  'value': 3,
				  'random': true,
				  'anim': {
					'enable': false,
					'speed': 40,
					'size_min': 0.1,
					'sync': false
				  }
				},
				'line_linked': {
				  'enable': true,
				  'distance': 150,
				  'color': color,
				  'opacity': 1,
				  'width': 1
				},
				'move': {
				  'enable': true,
				  'speed': 2,
				  'direction': 'none',
				  'random': false,
				  'straight': false,
				  'out_mode': 'out',
				  'bounce': false,
				  'attract': {
					'enable': false,
					'rotateX': 600,
					'rotateY': 1200
				  }
				}
			  },
			  'interactivity': {
				'detect_on': 'canvas',
				'events': {
				  'onhover': {
					'enable': true,
					'mode': 'grab'
				  },
				  'onclick': {
					'enable': true,
					'mode': 'push'
				  },
				  'resize': true
				},
				'modes': {
				  'grab': {
					'distance': 140,
					'line_linked': {
					  'opacity': 1
					}
				  },
				  'bubble': {
					'distance': 400,
					'size': 40,
					'duration': 2,
					'opacity': 8,
					'speed': 3
				  },
				  'repulse': {
					'distance': 200,
					'duration': 0.4
				  },
				  'push': {
					'particles_nb': 4
				  },
				  'remove': {
					'particles_nb': 2
				  }
				}
			  },
			  'retina_detect': true
			}, function() {
		console.log('callback - particles.js config loaded');
		console.log(JSON.stringify(url));
	});
	
});
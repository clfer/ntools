// ==UserScript==
// @name         NTools
// @author       NerOcrO
// @description  Script who help developers on Drupal 7
// @grant        none
// @include      localhost
// @version      2.0
// ==/UserScript==

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

nToolsCookie = {
  // Create/edit a cookie.
  create: function (name, value, days) {
    'use strict';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = '; expires=' + date.toGMTString();
    }
    else {
      var expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  },

  // Read a cookie.
  read: function (name) {
    'use strict';
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  },

  // Delete a cookie.
  erase: function (name) {
    'use strict';
    nToolsCookie.create(name, '', -1);
  }
}

nToolsHelper = {
  // Configure appropriately entities translation.
  configuringEntityTranslation: function () {
    'use strict';
    jQuery('#entity-translation-admin-form').find('fieldset').each(function () {
      jQuery('select option[value="xx-et-default"]', this).attr("selected", true);
      jQuery('input[id*="-hide-language-selector"]', this).prop('checked', true);
      jQuery('input[id*="-exclude-language-none"]', this).prop('checked', true);
      jQuery('input[id*="-shared-fields-original-only"]', this).prop('checked', true);
    });
  },

  // Set <hidden> for all fields label in "Manage display".
  hideAllFieldLabel: function () {
    'use strict';
    jQuery('#field-display-overview').find('tbody td:nth-child(4) select option[value="hidden"]').each(function () {
      jQuery(this).attr("selected", true);
    });
  },
  // Set <hidden> for all fields format in "Manage display".
  hideAllField: function () {
    'use strict';
    jQuery('#field-display-overview').find('tbody td:nth-child(5) select option[value="hidden"]').each(function () {
      jQuery(this).attr("selected", true);
    });
  },

  // Add an overlay on the target element.
  addOverlay: function (node, type, output, links ) {
    'use strict';
    var nameLinks = jQuery('<span/>')
      .addClass('ntools-links');
    for (var i = 0; i < links.length; i++) {
      nameLinks.append(links[i]);
    }

    jQuery(node).append(
      jQuery('<div></div>')
        .addClass('ntools-highlight')
        .append(
          jQuery('<div></div>')
            .addClass('ntools-' + type + '-name')
            .html(output)
            .prepend(nameLinks)
            .click(function (e) {
              e.stopPropagation();
            })
        )
        .click(function () {
          nToolsHelper.deleteOverlay(type, this);
        })
    );
  },

  // Delete one or more overlay.
  deleteOverlay: function (type, node) {
    'use strict';
    if (typeof node === 'object') {
      var node = jQuery(node).parent();

      if (jQuery('.' + type).find('.ntools-highlight').length === 1) {
        var flag = true;
      }
    }
    else {
      var node = jQuery('.show-' + type),
        flag = true;
    }

    node.find(' > .ntools-highlight').remove();
    node.removeClass('show-' + type);
    if (flag) {
      jQuery('.ntools-' + type + 's-toggle').html('Show ' + type.capitalize() + 's');
    }

    // If there is no overlay left, we remove the 'Hide all' button.
    if (jQuery('.ntools-highlight').length === 0) {
      jQuery('.ntools-hide-all-toggle').remove();
    }
  },

  // Add the "Hide all" button that delete all overlays.
  addhideAllButton: function (type) {
    'use strict';
    if (jQuery('.ntools-hide-all-toggle').length === 0) {
      jQuery('body').find('.ntools').append(
        jQuery('<button></button>')
          .html('Hide all')
          .addClass('ntools-hide-all-toggle')
          .click(function () {
            nToolsHelper.deleteOverlay('region');
            nToolsHelper.deleteOverlay('block');
            nToolsHelper.deleteOverlay('view');
            nToolsHelper.deleteOverlay('node');
            nToolsHelper.deleteOverlay('profile');
            nToolsHelper.deleteOverlay('field');
            nToolsHelper.deleteOverlay('form');
          })
      )
    }
  },

  // Prepend a <td> on the target element.
  addTd: function (node, output) {
    'use strict';
    jQuery(node).prepend(
      jQuery('<td></td>')
        .addClass('ntools-help')
        .html(output)
    );
  },

  // Prepend a <span> on the target element
  addSpan: function (node, selector, output) {
    'use strict';
    jQuery(node).find(selector).prepend(
      jQuery('<span></span>')
        .addClass('ntools-help')
        .html(output)
    );
  },

  // Create a <th>.
  createTh: function (output, colspan) {
    'use strict';
    output = typeof output !== 'undefined' ? output : 'Machine name';
    colspan = typeof colspan !== 'undefined' ? colspan : 1;

    return jQuery('<th></th>')
      .attr('colspan', colspan)
      .html(output);
  },

  // Create a _blank link.
  createLink: function (href, title, output) {
    'use strict';
    return jQuery('<a></a>')
      .attr('href', href)
      .attr('target', '_blank')
      .attr('title', title)
      .html(output)
      .click(function (e) {
        e.stopPropagation();
      });
  },
}

nTools = {

backOffice: function () {
  'use strict';

  var slash = new RegExp('/', 'g');

  /*
   *****************************************************************************
   * Structure
   *****************************************************************************
   */
  // Ajout de la machine name sur la liste des blocs.
  jQuery('#block-admin-display-form thead tr').prepend(nToolsHelper.createTh());
  jQuery('#block-admin-display-form tbody tr').each(function () {
    var a = jQuery(this).find('a[id*="edit-"]').attr('href'),
      output = '-',
      href = [];

    if (a !== undefined) {
      href = a.split(slash);
      output = href[href.length - 3] + " → ['" + href[href.length - 2] + "']";
    }

    nToolsHelper.addTd(this, output);
  });

  // Add VID in the vocabularies list.
  jQuery('#taxonomy-overview-vocabularies thead tr').prepend(nToolsHelper.createTh('VID'));
  jQuery('#taxonomy-overview-vocabularies tbody tr').each(function () {
    var a = /(.+)\[.+\]/g.exec(jQuery(this).find('select').attr('name'));

    nToolsHelper.addTd(this, a[1]);
  });
  // Add machine name in the vocabularies list.
  jQuery('#taxonomy-overview-vocabularies thead tr').prepend(nToolsHelper.createTh());
  jQuery('#taxonomy-overview-vocabularies tbody tr').each(function () {
    var a = jQuery(this).find('a[id*="edit-"]').attr('href').split(slash);

    nToolsHelper.addTd(this, a[a.length - 2]);
  });
  // Add links "Manage fields" and "Manage display" in the vocabularies list.
  jQuery('#taxonomy-overview-vocabularies thead tr').append(nToolsHelper.createTh('Operations +', 2));
  jQuery('#taxonomy-overview-vocabularies tbody tr').each(function () {
    var a = jQuery(this).find('a[id*="edit-"]').attr('href').split(slash),
      url = a[a.length - 2],
      aField = jQuery('<a></a>').attr('href', '/admin/structure/taxonomy/' + url + '/fields').html('Manage fields'),
      aDisplay = jQuery('<a></a>').attr('href', '/admin/structure/taxonomy/' + url + '/display').html('Manage display'),
      tdField = jQuery('<td></td>').addClass('ntools-help').html(aField),
      tdDisplay = jQuery('<td></td>').addClass('ntools-help').html(aDisplay);

      jQuery(this).append(tdField).append(tdDisplay);
  });

  // Add TID in terms list.
  jQuery('#taxonomy-overview-terms thead tr').prepend(nToolsHelper.createTh('TID'));
  jQuery('#taxonomy-overview-terms tbody tr').each(function () {
    var a = /:(.+):/.exec(jQuery(this).find('input').attr('name'));

    nToolsHelper.addTd(this, a[1]);
  });

  // Add a button to hide all fields label on "Manage display" page.
  jQuery('#field-display-overview').find('th:nth-child(4)').append(
    jQuery('<button></button>')
      .html('Hide all')
      .addClass('ntools-hidden')
      .click(function () {
        nToolsHelper.hideAllFieldLabel();
        return false;
      })
  );

  // Add a button to hide all fields on "Manage display" page.
  jQuery('#field-display-overview').find('th:nth-child(5)').append(
    jQuery('<button></button>')
      .html('Hide all')
      .addClass('ntools-hidden')
      .click(function () {
        nToolsHelper.hideAllField();
        return false;
      })
  );

  // Add machine name in views list.
  jQuery('#views-ui-list-page thead tr').prepend(nToolsHelper.createTh());
  jQuery('#views-ui-list-page tbody tr').each(function () {
    var a = jQuery(this).find('.first a').attr('href').split(slash);

    nToolsHelper.addTd(this, '$view->name = \'' + a[a.length - 2] + '\';');
  });

  // Add link to the corresponding field collection in "Manage fields" list.
  jQuery('#field-overview tbody tr').each(function () {
    var text = jQuery(this).find('td:nth-child(5)').text();

    if (text === 'Field collection') {
      var field = jQuery(this).find('td:nth-child(4)'),
        textField = field.html();

      field.html('')
        .prepend(
          jQuery('<a></a>')
            .attr('href', '/admin/structure/field-collections/' + textField + '/fields')
            .addClass('ntools-help')
            .html(textField)
        );
    }
  });

  /*
   *****************************************************************************
   * People
   *****************************************************************************
   */
  // Add UID in users list.
  jQuery('#user-admin-account tbody tr').each(function () {
    var a = /\/user\/(.+)\/edit/.exec(jQuery(this).find('td:last-child a').attr('href'));

    nToolsHelper.addSpan(this, 'td:nth-child(2)', '(' + a[1] + ') ');
  });

  // Add machine name in permissions list.
  var permission = jQuery('#user-admin-permissions, #og-ui-admin-global-permissions');
  permission.find('thead tr').prepend(nToolsHelper.createTh());
  permission.find('tbody tr').each(function () {
    var tableau = /\[(.+)\]/.exec(jQuery(this).find('input').attr('name')),
      output = '-';

    if (tableau !== null) {
      output = "'" + tableau[1] + "'";
    }

    nToolsHelper.addTd(this, output);
  });

  // Add RID in roles list.
  jQuery('#user-roles tbody tr').each(function () {
    var a = /\/admin\/people\/permissions\/(.+)/.exec(jQuery(this).find('td:last-child a').attr('href'));

    if (a !== null) {
      nToolsHelper.addSpan(this, 'td:first-child', '(' + a[1] + ') ');
    }
  });

  /*
   *****************************************************************************
   * Modules
   *****************************************************************************
   */
  // Add machine name in modules list.
  jQuery('#system-modules thead tr').prepend(nToolsHelper.createTh());
  jQuery('#system-modules tbody tr').each(function () {
    var tableau = /\[.+\]\[(.+)\]\[.+\]/g.exec(jQuery(this).find('input').attr('name'));

    nToolsHelper.addTd(this, tableau[1]);
  });

  /*
   *****************************************************************************
   * Configuration
   *****************************************************************************
   */
  // Add a button to configure appropriately all entities translation.
  jQuery('#entity-translation-admin-form').find('#edit-actions').append(
    jQuery('<button></button>')
      .html('Configuring')
      .addClass('ntools-hidden')
      .click(function () {
        nToolsHelper.configuringEntityTranslation();
        return false;
      })
  );

  /*
   *****************************************************************************
   * Reports
   *****************************************************************************
   */
  // Allow to sort the fields list.
  jQuery('.page-admin-reports-fields').find('.sticky-enabled th').click(function() {
    var table = jQuery(this).parents('table').eq(0),
      rows = table.find('tr:gt(0)').toArray().sort(compare(jQuery(this).index()));
    table.find('th').removeClass();
    jQuery(this).addClass('active');
    this.asc = !this.asc;

    if (!this.asc) {
      rows = rows.reverse();
    }

    for (var i = 0; i < rows.length; i++) {
      table.append(rows[i]);
    }

    function compare(index) {
      return function (a, b) {
        var valA = jQuery(a).children('td').eq(index).html(),
          valB = jQuery(b).children('td').eq(index).html();
        return !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB)) ? valA - valB : valA.localeCompare(valB);
      }
    }
  });
},

toolbar: function () {
  'use strict';

  var body = jQuery('body'),
    bodyClasses = body.attr('class'),
    pageNode = /page-node-([0-9]+)/.exec(bodyClasses),
    nodeType = /node-type-(\S+)/.exec(bodyClasses),
    pageType = /page-type-(\S+)/.exec(bodyClasses),
    pageTaxonomy = /page-taxonomy-term-([0-9]+)/.exec(bodyClasses),
    pageUser = /page-user-([0-9]+)/.exec(bodyClasses),
    pageContext = bodyClasses.match(/context-(\S+)/g),
    bodyClass = '',
    empty = new RegExp(' ', 'g'),
    slash = new RegExp('/', 'g'),
    dash = new RegExp('-', 'g'),
    login = jQuery('.logged-in').length,
    positions = '',
    stylePosition1 = '',
    stylePosition2 = '',
    ntoolsToggle = '',
    masquerade = jQuery('#block-masquerade-masquerade'),
    myTypes = [
      {
        id: 'region',
        type: 'region',
      },
      {
        id: 'block',
        type: 'block',
      },
      {
        id: 'view',
        type: 'view',
      },
      {
        id: 'node',
        type: 'node',
      },
      {
        id: 'entity-profile2',
        type: 'profile',
      },
      {
        id: 'field',
        type: 'field',
      },
      {
        id: 'form',
        type: 'form',
      },
    ];

  // Read last ntools popup position to restore it.
  if (nToolsCookie.read('ntools_toggle_positions') !== null) {
    positions = nToolsCookie.read('ntools_toggle_positions').split(':'),
    stylePosition1 = ' style="position:fixed;top:' + positions[0] + 'px;left:' + positions[1] + 'px"',
    stylePosition2 = ' style="position:fixed;top:' + positions[2] + 'px;left:' + positions[1] + 'px"';
  }

  // Ntools toggle button
  body.append('<div class="ntools-toggle"' + stylePosition1 + '><button>≡≡≡≡≡≡≡</button></div>');
  ntoolsToggle = jQuery('.ntools-toggle');
  ntoolsToggle.dblclick(function () {
    jQuery('.ntools').slideToggle('fast');
    // Write the toggle state in the cookie
    if (nToolsCookie.read('ntools_toggle') === 'off') {
      nToolsCookie.create('ntools_toggle', 'on', 30);
    }
    else {
      nToolsCookie.create('ntools_toggle', 'off', 30);
    }
  })
  .mousedown(function (e) {
    window.addEventListener('mousemove', nToolsMove, true);
  })
  .mouseup(function (e) {
    window.removeEventListener('mousemove', nToolsMove, true);
    nToolsCookie.create('ntools_toggle_positions', e.clientY + ':' + parseFloat(e.clientX - 50) + ':' + (parseFloat(e.clientY) + parseFloat(ntoolsToggle.height())), 30);
  });

  body.append('<div class="ntools"' + stylePosition2 + '></div>');
  // Restore toggle state from cookie
  if (nToolsCookie.read('ntools_toggle') === 'off') {
    jQuery('.ntools').css('display', 'none');
  }
  else {
    nToolsCookie.create('ntools_toggle', 'on', 30);
  }

  function nToolsMove(e) {
    var ntools = jQuery('.ntools'),
      top1 = e.clientY,
      left1 = e.clientX - 50,
      top2 = parseFloat(top1) + ntoolsToggle.height();

    ntoolsToggle.css({'position': 'fixed', 'top': top1 + 'px', 'left': left1 + 'px'});

    ntools.css({'position': 'fixed', 'top': top2 + 'px', 'left': left1 + 'px'});
  }

  // Add a "Log in" link with a destination parameter
  if (login === 0) {
    body.find('.ntools').append(
      jQuery('<div></div>')
        .addClass('ntools-user')
        .append(
          jQuery('<a></a>')
            .attr('href', '/user?destination=' + window.location.pathname)
            .html('Log in')
        )
    );
  }
  // Add a "Log out" link
  else {
    body.find('.ntools').append(
      jQuery('<div></div>')
        .addClass('ntools-user')
        .append(
          jQuery('<a></a>')
            .attr('href', '/user/logout')
            .html('Log out')
        )
    );
  }

  // Display body interesting classes
  if (pageNode !== null) {
    bodyClass += pageNode[0] + '<br>';
  }
  if (nodeType !== null) {
    bodyClass += nodeType[0] + '<br>';
  }
  if (pageType !== null) {
    bodyClass += pageType[0] + '<br>';
  }
  if (pageTaxonomy !== null) {
    bodyClass += pageTaxonomy[0] + '<br>';
  }
  if (pageUser !== null) {
    bodyClass += pageUser[0] + '<br>';
  }
  if (pageContext !== null) {
    var arrayLength = pageContext.length;
    for (var i = 0; i < arrayLength; i++) {
      var context = pageContext[i].split('context-');
      bodyClass += pageContext[i];
      if (login === 1) {
        bodyClass += ' [<a href="/admin/structure/context/list/' + context[1].replace(dash, '_') + '/edit" title="Edit your context" target="_blank">E</a>]';
      }
      bodyClass += '<br>';
    }
  }
  if (bodyClass !== '') {
    body.find('.ntools').append('<div class="ntools-body-class">' + bodyClass + '</div>');
  }

  // Move Masquerade bloc to the ntools popup for easier access.
  body.find('.ntools').append(masquerade);

  // Remove a (useless) phrase from the Masquerade bloc
  masquerade.find('.description')
    .contents()
    .filter(function () {
      return this.nodeType !== 1;
    })
    .remove();

  // Add users roles
  masquerade.find('#quick_switch_links li').each(function () {
    var a = jQuery(this).find('a'),
      uid = /\/([0-9]+)\?token/.exec(a.attr('href')),
      roles = [];

    if (uid !== null && uid[1] !== '0') {
      jQuery.get(
        '/user/' + uid[1] + '/edit',
        function (data) {
          jQuery('#edit-roles input:checked', data).each(function () {
            roles.push(jQuery('label[for=' + jQuery(this).attr('id') + ']', data).text());
          });

          a.attr('title', roles.join("\r\n"));
        }
      );
    }
  });

  jQuery.each(myTypes, function () {
    if (this.type === 'form') {
      var node = jQuery(this.id),
        type = this.type;
    }
    else {
      var node = jQuery('.' + this.id),
        type = this.type;
    }

    if (node[0] !== undefined) {
      body.find('.ntools').append(
        jQuery('<button></button>')
              .html('Show ' + type.capitalize() + 's')
              .addClass('ntools-' + type + 's-toggle')
              .click(function () {
                if (jQuery('.show-' + type).length === 0) {
                  jQuery(this).html('Hide ' + type.capitalize() + 's');

                  node.addClass('show-' + type).each(function () {
                    var target = jQuery(this),
                      targetClass = target.attr('class'),
                      targetId = target.attr('id'),
                      classNode = targetClass.split(' '),
                      output = '',
                      link = null,
                      links = [];

                    // Regions overlay toggle button
                    if (type === 'region') {
                      var classRegion = /region region-([a-z0-9-]+) /.exec(targetClass);

                      output = classRegion[1].replace(dash, '_');
                    }
                    // Bloc overlay toggle button
                    else if (type === 'block') {
                      var classBlock = /block block--?([a-z0-9-]+) /.exec(targetClass),
                        nameBlockReg = new RegExp('block-' + classBlock[1] + '-', 'g'),
                        whithoutDash = classBlock[1].replace(dash, '_'),
                        idBlock = targetId.replace(nameBlockReg, '').replace(dash, '_');

                      // This link is a shortcut to edit the block. Replace contextual links.
                      if (login === 1) {
                        link = nToolsHelper.createLink('/admin/structure/block/manage/' + whithoutDash + '/' + idBlock + '/configure', 'Edit your block', 'E');
                        links.push(link);
                      };

                      output = whithoutDash + " → ['" + idBlock + "']";
                    }
                    // Views overlay toggle button.
                    else if (type === 'view') {
                      var classView = /view view-(\S+)/.exec(targetClass),
                        classIdView = /view-display-id-(\S+)/.exec(targetClass),
                        whithoutDash = classView[1].replace(dash, '_');

                      // This link is a shortcut to edit the view. Replace contextual links.
                      if (login === 1) {
                        var url = nTools.drupalVersion == 7 ? '/admin/structure/views/view/' + whithoutDash + '/edit/' + classIdView[1] : '/admin/build/views/edit/' + whithoutDash + '#view-tab-' + classIdView[1];
                        link = nToolsHelper.createLink(url, 'Edit your view', 'E');
                        links.push(link);
                      };

                      output = whithoutDash + ' → ' + classIdView[1];
                    }
                    // Nodes overlay toggle button.
                    else if (type === 'node') {
                      var nid = targetId.replace('node-', '')
                      if(typeof nid == 'undefined' || nid == ''){
                        var matches = /node-([0-9]+)/.exec(targetClass);
                        nid = matches[1];
                      }
                      var  whithoutDash = classNode[1].replace(dash, '_'),
                        whithoutNode = whithoutDash.replace('node_', ''),
                        classTeaser = /node-teaser/.exec(targetClass),
                        classPromoted = /node-promoted/.exec(targetClass),
                        classSticky = /node-sticky/.exec(targetClass),
                        classUnpublished = /node-unpublished/.exec(targetClass),
                        displayMode = '',
                        display = '',
                        properties = [],
                        flag = false;

                      if (classPromoted !== null) {
                        properties.push('P');
                        flag = true;
                      }
                      if (classSticky !== null) {
                        properties.push('S');
                        flag = true;
                      }
                      if (classUnpublished !== null) {
                        properties.push('U');
                        flag = true;
                      }
                      if (flag) {
                        properties = ' (' + properties.join() + ')';
                      }

                      // Only the teaser view mode is normalized.
                      if (classTeaser !== null) {
                        displayMode = ' → teaser';
                        display = '/teaser';
                      }

                      link = nToolsHelper.createLink('/node/' + nid , 'View this node', 'V');
                      links.push(link);
                      // This links are shortcuts to edit this node or this node type fields and display. Replace contextual links.
                      if (login === 1) {
                        link = nToolsHelper.createLink('/node/' + nid + '/edit', 'Edit this node', 'E');
                        links.push(link);
                        link = nToolsHelper.createLink('/admin/structure/types/manage/' + whithoutNode + '/fields', 'Manage your ' + whithoutNode + ' fields', 'F');
                        links.push(link);
                        link = nToolsHelper.createLink('/admin/structure/types/manage/' + whithoutNode + '/display' + display, 'Manage your ' + whithoutNode + ' displays', 'D');
                        links.push(link);
                      }

                      output = whithoutDash + properties + displayMode;
                    }
                    // Profiles overlay toggle button.
                    else if (type === 'profile') {
                      var whithoutDash = classNode[1].replace(dash, '_'),
                        whithoutProfile = classNode[2].replace(dash, '_').replace('profile2_', '');

                      // This links are shortcuts to edit this profile fields and display. Replace contextual links.
                      if (login === 1) {
                        link = nToolsHelper.createLink('/admin/structure/profiles/manage/' + whithoutProfile + '/fields', 'Manage your ' + whithoutProfile + ' fields', 'F');
                        links.push(link);
                        link = nToolsHelper.createLink('/admin/structure/profiles/manage/' + whithoutProfile + '/display', 'Manage your ' + whithoutProfile + ' displays', 'D');
                        links.push(link);
                      }

                      output = whithoutDash + ' → ' + classNode[2].replace(dash, '_');
                    }
                    // Fields overlay toggle button.
                    else if (type === 'field') {
                      output = classNode[1].replace(dash, '_').replace('field_name_', '') + ' (' + classNode[2].replace(dash, '_');
                    }
                    // Forms overlay toggle button.
                    else if (type === 'form') {
                      output = targetId.replace(dash, '_');
                    }
                    nToolsHelper.addOverlay(this, type, output, links);
                  });

                  nToolsHelper.addhideAllButton();
                }
                else {
                  nToolsHelper.deleteOverlay(type);
                }
              })
      );
    }
  });
},

loginFocus: function () {
  // Autofocus  on the login field.
  jQuery('#edit-name').focus();
},

styles: function () {
  'use strict';

  var styles = (function () {/*
.page-admin table .odd:hover,
.page-admin table .even:hover,
.homebox-column-wrapper table .odd:hover,
.homebox-column-wrapper table .even:hover {
  background-color: #E1E2DC;
}
.page-admin-reports-fields .sticky-enabled th {
  cursor: pointer;
}
.ntools-help,
.ntools-help * {
  color: #4D8F46;
  font-weight: 900;
}
.ntools-toggle {
  position: fixed;
  left: 0;
  top: 125px;
  z-index: 900;
}
.ntools-toggle button {
  background: #202020;
  border: none;
  border-radius: 0;
  color: #FFF;
  cursor: move;
  font-family: Helvetica;
  font-size: 14px;
  margin: 0;
  padding: 2px 5px;
  width: 100px;
}
.ntools {
  background-color: #202020;
  color: #FFF;
  min-width: 105px;
  padding: 5px 5px 0 5px;
  position: fixed;
  left: 0;
  top: 149px;
  z-index: 900;
}
.ntools * {
  box-sizing: content-box;
  font: 400 14px/18px Helvetica;
}
.ntools a {
  color: #0071B3;
}
.ntools a:link,
.ntools a:visited {
  text-decoration: none;
}
.ntools a:hover,
.ntools a:focus {
  color: #018FE2;
}
.ntools > div {
  margin-bottom: 3px;
  padding-bottom: 2px;
}
.ntools-user {
  border-bottom: 1px solid #FFF;
}
#block-masquerade-masquerade,
.ntools-body-class {
  border-bottom: 1px solid #FFF;
}
#block-masquerade-masquerade h2 {
  display: none;
}
#edit-masquerade-user-field,
#block-masquerade-masquerade input.form-submit {
  border: 1px solid black;
  border-radius: 0;
}
#block-masquerade-masquerade .content,
#block-masquerade-masquerade .form-item {
  margin: 0;
}
#block-masquerade-masquerade .item-list ul li {
  margin: 0;
  padding: 0;
}
.ntools button {
  border: none;
  border-radius: 0;
  color: #FFF;
  cursor: pointer;
  display: block;
  margin: 0 0 5px;
  padding: 2px 5px;
  width: 93%;
}
.ntools-regions-toggle {
  background: #018FE2;
}
.ntools-regions-toggle:hover {
  background: #0073B7;
}
.ntools-blocks-toggle {
  background: #B73939;
}
.ntools-blocks-toggle:hover {
  background: #9F2B2B;
}
.ntools-views-toggle {
  background: #FFA300;
}
.ntools-views-toggle:hover {
  background: #DA900C;
}
.ntools-nodes-toggle,
.ntools-profiles-toggle {
  background: #4D8F46;
}
.ntools-nodes-toggle:hover,
.ntools-profiles-toggle:hover {
  background: #277D1E;
}
.ntools-fields-toggle {
  background: #783A00;
}
.ntools-fields-toggle:hover {
  background: #4E2500;
}
.ntools-forms-toggle {
  background: #4A3657;
}
.ntools-forms-toggle:hover {
  background: #3B2549;
}
.ntools-hide-all-toggle {
  background: #000;
}
.ntools-hide-all-toggle:hover {
  background: #3B3B3B;
}
.region.show-region,
.block.show-block,
.view.show-view,
.node.show-node,
.profile.show-profile,
.field.show-field,
.form.show-form {
  position: relative;
}
.ntools-highlight {
  background-color: #000;
  cursor: pointer;
  height: 100%;
  left: 0;
  opacity: .7;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 19;
}
.ntools-highlight div {
  color: #FFF;
  cursor: initial;
  font: 400 14px/18px Helvetica;
  padding: 0 2px;
  position: absolute;
  right: 0;
  text-align: right;
  text-transform: none;
  top: 0;
  width: 100%;
  word-wrap: break-word;
  z-index: 20;
}
.ntools-highlight a[target="_blank"] {
  background: #000;
  color: #FFF;
  padding: 0 4px;
}
.ntools-highlight a[target="_blank"]:hover {
  color: red;
}
.ntools-region-name {
  background-color: #018FE2;
}
.ntools-block-name {
  background-color: #B73939;
}
.ntools-view-name {
  background-color: #FFA300;
}
.ntools-profile-name,
.ntools-node-name {
  background-color: #4D8F46;
}
.ntools-field-name {
  background-color: #783A00;
}
.ntools-form-name {
  background-color: #4A3657;
}
.ntools-links a {
  margin-right: 3px;
}
.ntools-hidden {
  background: #000;
  border: none;
  color: #FFF;
  cursor: pointer;
  margin-left: 5px;
  padding: 5px;
}*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

  jQuery('head')
    .append(
      jQuery('<style></style>')
        .append(document.createTextNode(styles)));
},
};

jQuery(function () {
  if(typeof Drupal != 'undefined'){
    nTools.styles();

    nTools.drupalVersion = (typeof Drupal.themes == 'undefined') ? 7 : 6;

    // Add a title with name/value on each input/textarea/select.
    jQuery('input, textarea, select').each(function () {
      var input = jQuery(this),
        output = 'Name: ' + input.attr('name');

      if (input.attr('type') === 'checkbox' || input.attr('type') === 'radio') {
        output += '\nValue: ' + input.val();
      }

      input.attr('title', output);
    });

    // Add a title with value on each option
    jQuery('option').each(function () {
      var input = jQuery(this);

      input.attr('title', 'Value: ' + input.val());
    });

    if (jQuery('body[class*="page-admin"]').length === 1) {
      nTools.backOffice();
    }
    else {
      nTools.toolbar();
      nTools.loginFocus();
    }
  }
});

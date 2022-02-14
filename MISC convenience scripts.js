// ==UserScript==
// @name         MISC-MONKEY convenience scripts
// @match        redmine.tribepayments.com/*
// @match        git.tribepayments.com/*
// @version      1.0.47
// @downloadURL  https://misc.tribepayments.com/monkey/tribe.user.js
// ==/UserScript==

(function(window) {
    'use strict';
    const colorEstimate = '#9DB905';
    const colorSpent = '#0DB9D5';
    const colorLeft = '#C36DE3';

    const rfcTrackerID = '18';
    const releaseTrackerID = '19';

    const customFieldOpsChatId = '105';
    const customFieldTechChatId = '106';

    const branchCompareUrl = 'https://git-watcher.tribepayments.com/tools/multiproject-branch-task-compare/%%RELEASE_BRANCH%%/%%ENCODED_PROJECT_NAMESPACES%%/';

    //------ START Functionality handlers -------------------------------------------
    const issuesHighlighter = () => {
        var statusColors = {
            'Pending Approval': '#fcf3cf',
            'Not Approved': '#eafaf1',
            'New': '#82e0aa',
            'In Progress': '#f7db6f',
            'Resolved': '#85c1e9',
            'Feedback': '#ec7063',
            'Closed': '#d5d8dc',
            'Rejected': '#abb2b9',
            'Suspended': '#fdedec',
            'In progress (LT-PM)': '#f5e295',
            'In progress (LT-APP)': '#f5e295',
            'In progress (LT-OPS)': '#f5e295',
            'In progress (INFRA)': '#f5e295',
            'In progress (LT-DEVOPS)': '#f5e295',
            'Pending (LT-OPS)': '#f7f2dc',
            'Pending (LT-APP)': '#f7f2dc',
            'Pending (LT-PM)': '#f7f2dc',
            'Pending (INFRA)': '#f7f2dc',
            'Pending (LT-DEVOPS)': '#f7f2dc',
        };

        $.each($('table.issues tbody tr'), function(key, val) {
            var a = $(".status", $(val));
            var status = a.text();
            $(a).parent().css('background', statusColors[status]).css('border-top', '1px solid white').find('a').css('color', 'black');
        });
    };
    //-------------------------------------------------------------------------------
    const issuesGroupsTimes = () => {
        $.each($('table.issues tbody tr.group'), function(key, val) {
            // get counts
            var countTask = parseFloat($(".count", $(val)).text());
            var hoursEstimate = parseFloat($(".total-for-estimated-hours > .value", $(val)).text());
            var hoursSpent = parseFloat($(".total-for-spent-hours > .value", $(val)).text());
            if (isNaN(countTask) || isNaN(hoursEstimate) || isNaN(hoursSpent)){
                return;
            }
            var hoursLeft = hoursEstimate - hoursSpent;

            // prepare new shiny badges
            var colorLeftDynamic = hoursLeft >= 0 ? colorLeft : 'red';
            var badges = {
                'countTask': {'content': countTask, 'title': 'Task count', 'background': '#9DB9D5', 'suffix': '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' },
                'hoursEstimate': {'content': hoursEstimate.toFixed(2), 'title': 'Estimated hours', 'background': colorEstimate, 'suffix': ' - '},
                'hoursSpent': {'content': hoursSpent.toFixed(2), 'title': 'Spent hours', 'background': colorSpent, 'suffix': ' = '},
                'hoursLeft': {'content': hoursLeft.toFixed(2), 'title': 'Left hours', 'background': colorLeftDynamic, 'suffix': ''}
            };
            var badgesHtml = '';
            $.each(badges, function(key, val) {
                badgesHtml += '<span class="count" title="'+val['title']+'" style="display: inline-block; text-align: right; width: 50px; background: '+val['background']+'; font-weight: bold; cursor: help; color: white; padding: 2px; border-radius: 2px;">'+val['content']+'</span>'+val['suffix'];

            });

            // manipulate DOM
            $('.name', $(val)).css({'width': '100px', 'display': 'inline-block'});
            $(".count", $(val)).remove();
            $(".totals", $(val)).html(badgesHtml);
        });
    };
    //-------------------------------------------------------------------------------
    const issueTimes = () => {
        function getBadgeHtml(color, html){
            return '<span class="count" style="display: inline-block; border-radius: 3px; text-align: right; width: 75px; color: white; font-weight: bold; padding-right: 5px; background: '+color+'">'+html+'</span>'
        }
        function getTimeBadgeHtml(color, hours){
            return getBadgeHtml(color, hours.toFixed(2)+' h');
        }
        var attributes = $("#content > .issue > .attributes");

        // hours estimated
        var hoursEstimateDiv = $(".estimated-hours > .value");
        var hoursEstimate = parseFloat(hoursEstimateDiv.text());
        if (isNaN(hoursEstimate)) {
            return;
        }
        hoursEstimateDiv.html(getTimeBadgeHtml(colorEstimate, hoursEstimate));


        // hours spent
        var hoursSpentDiv = $(".spent-time > .value");
        var hoursSpent = parseFloat(hoursSpentDiv.text());
        if (isNaN(hoursSpent)){
            return;
        }
        var hoursSpentLinkHtml = hoursSpentDiv.html().replace('a href', 'a style="color:white" href');
        hoursSpentDiv.html(getBadgeHtml(colorSpent, hoursSpentLinkHtml));

        // hours left
        var hoursLeft = hoursEstimate - hoursSpent;
        var colorLeftDynamic = hoursLeft >= 0 ? colorLeft : 'red';
        hoursEstimateDiv.parent().parent().append(
            '<div class="left-time attribute"><div class="label">Left time:</div><div class="value">'+
            getTimeBadgeHtml(colorLeftDynamic, hoursLeft)+
            '</div></div>'
        );
    };
    //-------------------------------------------------------------------------------
    const calculateFeedbackRatio = () => {
        $('.totals').each(function(){
            var totalsElement = $(this);
            var feedbackCountElement = $('.total-for-cf-99 span.value', totalsElement);
            if (feedbackCountElement.length == 0) {
                return;
            }

            var feedbackCount = parseInt(feedbackCountElement.text(), 10);

            var timeElements = [
                $('.total-for-spent-hours span.value', totalsElement),
                $('.total-for-estimated-hours span.value', totalsElement)
            ];

            timeElements.forEach(function(timeElement){
                if (timeElement.length) {
                    var hours = parseFloat(timeElement.text());
                    var ratio = '∞';
                    if (feedbackCount > 0) {
                        if (isNaN(hours) || hours <= 0) {
                            ratio = '-';
                        } else {
                            ratio = (hours/feedbackCount).toFixed(2);
                        }
                    }
                    timeElement.text(timeElement.text()+' ('+ratio+' hours/feedback)');
                }
            });
        });
    };
    //-------------------------------------------------------------------------------
    const autofillTagDateTime = () => {
        Date.prototype.YYYYMMDD = function () {
            const yyyy = this.getFullYear().toString();
            const MM = (this.getMonth() + 1).toString().padStart(2, '0');
            const dd = this.getDate().toString().padStart(2, '0');

            return yyyy + MM + dd;
        };
        Date.prototype.HHMM = function () {
            const hh = this.getHours().toString().padStart(2, '0');
            const mm = this.getMinutes().toString().padStart(2, '0');

            return hh + mm;
        };

        const tagsIndex = {
            // UPC projects
            '/upc/blue': 'UPB',
            '/upc/front': 'UPF',
            '/upc/mobile-front': 'UMO',
            '/upc/black': 'UPA',
            '/upc/api': 'UPFA',
            '/upc/support': 'UPC',
            '/upc/newsletters': 'UPN',
            '/upc/support-chat': 'USC',
            '/upc/filebox': 'UFB',
            '/upc/res_locker': 'URL',
            '/upc/translations_update': 'UTU',
            '/upc/translations': 'UTR',

            // GTW projects
            '/gtw/misc': '',
            '/gtw/dispute-api': 'GDA',
            '/gtw/dispute-front': 'DFR',
            '/gtw/mini-gtw': '',
            '/gtw/api': 'GAP',
            '/gtw/front': 'GFR',
            '/gtw/core-int-hpp-pci': '',
            '/gtw/monitor': '',
            '/gtw/core-int-hpp': '',
            '/gtw/core-int-rest': 'CIR',
            '/gtw/poster': 'GPST',
            '/gtw/crypto-eth': 'CETH',
            '/gtw/crypto-xrp': 'CXRP',
            '/gtw/crypto-ltc': 'CLTC',
            '/gtw/crypto-bch': 'CBCH',
            '/gtw/crypto-btc': 'CBTC',
            '/gtw/docs': 'GTD',
            '/gtw/hyphen': 'HYP',
            '/gtw/core': 'GCR',
            '/gtw/vbank': 'GVB',
            '/gtw/securestore': 'GSS',
            '/gtw/core-int-rest-v2' : 'RST',

            // ISAC projects
            '/isac/distributed-lock': '',
            '/isac/vagrantbox': '',
            '/isac/riskapibox': '',
            '/isac/reports': 'IRE',
            '/isac/ehi-emulator': '',
            '/isac/hsm-api': 'HSM',
            '/isac/ac-merchant-gw': 'AMG',
            '/isac/ac-admin': 'AAD',
            '/isac/ac-core': 'ACC',
            '/isac/is-admin': 'CAD',
            '/isac/is-core': 'ICC',
            '/isac/is-front': 'ICF',
            '/isac/ds-dbapi': 'IDA',
            '/isac/ds-keymaster': 'IKM',
            '/isac/ci-worker': 'CIW',
            '/isac/ci-node': 'CIN',
            '/isac/3ds-acs': 'ACS',
            '/isac/3ds-mpi': 'TDS',
            '/isac/rats-nest': 'RAT',
            '/isac/postbox': 'IPB',

            // ISAC-POS projects
            '/isac-pos/host': 'IPH',
            '/isac-pos/worker': 'IPW',
            '/isac-pos/synchronizer': 'SYN',
            '/isac-pos/device-directory': 'DDR',

            // BANK projects
            '/bank/wire': 'BWI',
            '/bank/box': 'BNB',

            // OPENBANK projects
            '/openbank/tpp-admin': 'OTA',
            '/openbank/tpp-validator': 'OTV',
            '/openbank/tpp': 'OTP',
            '/openbank/bank': 'OBN',
            '/openbank/core': 'OCO',

            // MISC projects
            '/misc/monitor': 'MON',
            '/misc/notifications': '',
            '/misc/locker': '',
            '/misc/monkey': 'MMO',
            '/misc/ft-riskbox': 'FRS',
            '/misc/ftt': 'MFT',
            '/misc/dbapi': 'FDA',
            '/misc/ft-dbsync': 'MDS',
            '/misc/docbox': 'FDB',
            '/misc/keymanager': 'KM',
            '/misc/securebox': 'FSB',
            '/misc/ft-providerbox': 'MPB',
            '/misc/ft-gearman-monitor': 'FGM',
            '/misc/gitlab2redmine': 'G2R',
            '/misc/techadmin': 'TECH',
            '/misc/redmine_reports': 'RR',
            '/misc/debug_server': 'UPD',
            '/misc/quicktest': 'MQT',
            '/misc/riskmonitor-admin': 'RMD',
            '/misc/riskmonitor-api': 'RMA',
            '/misc/whitebox': 'WHB',
            '/misc/cronbox': 'CRB',
            '/misc/cronbox-worker': 'CRW',
            '/misc/cardframe': 'CDF',
        };

        var envBtnClass = 'btnEnv';

        var tag = document.getElementById('tag_name');
        var tagUrl = window.location.pathname.split('/').splice(0, 3).join('/');
        const defaultPrefix = '';
        let envButtons = [
            { text: 'SAND', branch: 'sandbox', class: 'btn btn-info', prefix: 'SAND' },
            { text: 'PRE', branch: 'predeploy', class: 'btn btn-warning', prefix: 'PRE' },
            { text: 'LIVE', branch: 'master', class: 'btn btn-success', prefix: defaultPrefix },
        ];
        tag.parentNode.classList.add('d-flex');
        for (let envBtn of envButtons) {
            let btn = document.createElement('button');
            btn.setAttribute('class', 'ml-1 ' + envBtn.class + ' ' + envBtnClass);
            btn.setAttribute('data-prefix', envBtn.prefix);
            btn.setAttribute('data-branch', envBtn.branch);
            btn.setAttribute('type', 'button');
            btn.innerText = envBtn.text;
            tag.parentNode.append(btn);
        }
        // get prefix from localStorage
        let prefix = window.localStorage.getItem('prefix') || defaultPrefix;
        for (let el of (document.getElementsByClassName(envBtnClass) || []) ) {
            el.addEventListener('click', (e) => {
                window.localStorage.setItem('prefix', e.target.getAttribute('data-prefix'));
                prefix = e.target.getAttribute('data-prefix');
                updateTag(e.target.getAttribute('data-branch'));
            });
        }

        const selectBranch = (branch) => {
            const branchLink = [...document.querySelector('.create-from').querySelectorAll('a')].find(el => el.innerText === branch);
            if (branchLink) {
                branchLink.click();
            }
        };

        const getCurrentConfig = () => {
            return envButtons.find(el => el.prefix === prefix);
        };

        const updateTag = (branch) => {
            var d = new Date();
            tag.value = (prefix ? `${prefix}_` : '')+(tagsIndex[tagUrl] || '')+'_'+d.YYYYMMDD()+'_'+d.HHMM();
            if (branch) {
                selectBranch(branch);
            }
        };

        if (tag.value === '') {
            updateTag(getCurrentConfig().branch);
        }
    };
    //-------------------------------------------------------------------------------
    const untickCopyCheckboxes = () => {
        $('#link_copy').removeAttr('checked');
        $('#copy_subtasks').removeAttr('checked');
    };
    //-------------------------------------------------------------------------------
    const getCurrentIssueId = function() {
        var issueTitle = $('h2').text();

        return parseInt(issueTitle.substr(issueTitle.indexOf("#") + 1), 10);
    }
    //-------------------------------------------------------------------------------
    const slackIssueSummary = () => {

        // only for Tracker="SLA ticket"
        var container = $('.tracker-3');
        if (container.length != 1) {
            return;
        }

        var dueDate = $('#issue_due_date').val();
        var dueTime = $('#issue_custom_field_values_95').text();
        var subject = $('h3', container).text();

        container.append('<hr><div><p><strong>Slack message</strong></p>'
            + '<div style="background: white; border: 1px solid #ccc; color: silver; padding: 5px;">'
            + '`' + dueDate + ' ' + dueTime + '` ' + subject + '<br>'
            + $(location).attr('href')
            + '</div>'
            + '</div>'
        );
    };
    //-------------------------------------------------------------------------------
    const prefillDefaultValuesSupport = () => {

        // only for Tracker="SLA ticket"
        if ($('#issue_tracker_id').val() != 3) {
            return;
        }

        // get date for tomorrow
        var d = new Date();
        d.setDate(d.getDate() + 1);
        var dY = d.getFullYear();
        var dM = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
        var dD = String(d.getDate()).padStart(2, '0');

        // set defaults
        $('#issue_due_date').val(dY + '-' + dM + '-' + dD);
        $('#issue_subject').val('');
        $('#issue_is_private_wrap, #watchers_form, #custom-subjects-div').remove();
        $('#parent_issue').hide();
        $('#issue_status_id').parent().parent().hide();
        var readOnlyStyle = 'background: #eee; pointer-events: none; touch-action: none;';
        $('#issue_tracker_id').attr('style', readOnlyStyle);

    };

    const prepareSupportTaskList = () => {
        var chatUrlCustomFieldIds = [customFieldOpsChatId, customFieldTechChatId];

        chatUrlCustomFieldIds.forEach(function (customFieldId) {
            $('a', 'td.cf_'+customFieldId).text('» link »');
        });
    };

    const prepareNewSupportTask = () => {
        var descriptionTemplates = {
            'Issue' :
                'h3. Steps to reproduce _(how, when, where exactly)_\n\n\n\n' +
                'h3. Result received _(screenshots, logs. video etc.)_\n\n\n\n' +
                'h3. Result expected _(how it should be? Optional, skip if obvious)_\n\n\n\n' +
                'h3. Additional details _(usernames, ids, error messages, etc.)_',
            'Access Request':
                'h3. Subproduct _(provide, if needed)_\n\n\n\n' +
                'h3. User details _(email, company, first name, last name, access level)_\n\n\n\n' +
                'h3. Permission roles _(which role(-s) should be assigned)_\n\n\n\n' +
                'h3. Write access _(yes/no)_',
            'Permissions Request':
                'h3. Subproduct _(provide, if needed)_\n\n\n\n' +
                'h3. User details _(email, company, first name, last name, access level)_\n\n\n\n' +
                'h3. Permission roles _(which role(-s) should be assigned)_\n\n\n\n' +
                'h3. Write access _(yes/no)_',
            'Change request':
                'h3. Purpose of the change _(why, what we want to achieve)_\n\n\n\n' +
                'h3. Structured requests bullet list _(try not to mix things, group as much as possible)_\n\n\n\n' +
                'h3. Result expected _(how it should be)_\n\n\n\n' +
                'h3. Additional details',
            'Knowledge share': 'h3. Result expected _(how it should be, what trying to achieve)_\n\n\n\n' +
                'h3. Question\n\n\n\n' +
                'h3. Resources checked already _(reviewed docs, spreadsheets, manuals list)_'

        };

        var descriptionField = $('#issue_description');
        var descriptionPrefills = $('<p id="description-prefill-holder">');
        descriptionPrefills.append('<label>Description template: </label>');
        for (var templateType in descriptionTemplates) {
            var template = descriptionTemplates[templateType];
            var button = $('<input type="button" value="'+templateType+'">');
            button.click(function(){
                if (descriptionField.val() !== '') {
                    if (!confirm("Are you sure? Currently set description will be replaced")) {
                        return;
                    }
                }
                descriptionField.val(descriptionTemplates[$(this).val()]);
            });
            descriptionPrefills.append(button);
        }

        descriptionField.parent().parent().prepend(descriptionPrefills);
    };

    //-------------------------------------------------------------------------------
    const prefillDefaultValues = () => {

        // default value for new incident ticket
        var now = new Date();
        var nowDay = String(now.getDate()).padStart(2, '0');
        var nowMonth = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
        var nowYear = now.getFullYear();

        //incident date
        $('#issue_custom_field_values_58').val(nowYear + '-' + nowMonth + '-' + nowDay);

        //incident reported date
        $('#issue_custom_field_values_46').val(nowYear + '-' + nowMonth + '-' + nowDay + ' ??:??:??');

        //RFC ticket planned start time
        $('#issue_custom_field_values_84').val(nowYear + '-' + nowMonth + '-?? ??:??:??');

        //RFC ticket planned end time
        $('#issue_custom_field_values_85').val(nowYear + '-' + nowMonth + '-?? ??:??:??');

        // DISABLED FOR NOW, AS THIS IS HIGHLY INDIVIDUAL
        // TODO: investigate defaults that make sense based on user/project/role/...

        /*
        $('#issue_status_id').val('11'); //Not approved 11 new 1
        //$('#issue_parent_issue_id').val('22531'); //parent task
        //$('#issue_custom_field_values_16').val('MISC');//report tag

        $('#issue_custom_field_values_18').attr('checked',false); //reports - planned
        // $('#issue_fixed_version_id').val($('#issue_fixed_version_id option:last-child').val()); //target version
        $("input[name='issue[custom_field_values][2][]']").eq(0).attr('checked',true); //UPC
        // $("input[name='issue[custom_field_values][2][]'][value='UPC']").attr('checked',true); //UPC
        $('#issue_tracker_id').val('1'); //BUG 1, TASK 4
        //$('#issue_estimated_hours').val(Math.floor((Math.random() * 4) + 2)); //issue_estimated_hours
        $('#issue_priority_id').val('2'); //Priority  2 normal 4 urgent 5 immediate
        $('#issue_custom_field_values_3').val('Developers');//For
        $('#issue_custom_field_values_5').val('Ruta Petraviciene'); //Reported by
        $('#issue_custom_field_values_6').val('Ruta Petraviciene'); //Responsible

        $('#issue_description').val("h1. Steps to reproduce:\n\nn/a\n\nh1. Result received:\n\nn/a\n\nh1. Result expected:\n\nn/a\n\nh1. Additional details:\n\nn/a"); //bug template
        $('#issue_description').height("300px"); // template netelpa

        // $('#issue_custom_field_values_32').val('Done');// Review status
        // $('#issue_custom_field_values_35').val('skip');// Business approval
        */
    };
    //-------------------------------------------------------------------------------
    const addFilterHideClosedButtonsToSubtasks = () => {
        var issueId = getCurrentIssueId();

        // add gray background on closed & rejected
        var divIssues = $("#issue_tree tr.issue");
        var cssClosed = {'color': '#999', 'text-decoration': 'line-through', 'text-overflow': 'ellipsis'};
        divIssues.each(function() {
            var status = $(':nth-child(3)', this).text();
            if (status === 'Closed' || status === 'Rejected'){
                $(this).addClass('subtask_closed').css(cssClosed).find('a').css(cssClosed);
            }
        });

        // add "Filter" button
        var divLinks = $("#issue_tree > .contextual");
        var urlTemplate = $('.overview')[0].href+'/issues?utf8=✓&set_filter=1&f[]=parent_id&op[parent_id]==&v[parent_id][]=%%ISSUE_ID%%&f[]=status_id&op[status_id]==&v[status_id][]=12&v[status_id][]=11&v[status_id][]=1&v[status_id][]=2&v[status_id][]=3&v[status_id][]=4&v[status_id][]=7&f[]=&c[]=tracker&c[]=status&c[]=priority&c[]=subject&c[]=assigned_to&c[]=estimated_hours&c[]=spent_hours&c[]=done_ratio&c[]=updated_on&group_by=status&t[]=estimated_hours&t[]=spent_hours';
        var url = urlTemplate.replace('%%ISSUE_ID%%', issueId);
        divLinks.append(' |<a href="'+url+'">Filter</a>');

        // add "Hide closed" button
        divLinks.append(' |<a href="#" id="hide_closed" onClick="return false;">Hide closed</a>');
        var hideLink = $('#hide_closed').click(function() {
            $('.subtask_closed').remove();
        });
    };
    //-------------------------------------------------------------------------------
    const linkRelatedIssues = function(issueId, issueIdsToLink) {
        if (!Array.isArray(issueIdsToLink) || issueIdsToLink.length === 0) {
            return;
        }

        var relatedIssueId = issueIdsToLink.pop();
        $.ajax({
            url: "/issues/"+issueId+"/relations",
            type: "post",
            data: {
                "utf8": "✓",
                "relation[relation_type]": "relates",
                "relation[issue_to_id]": relatedIssueId,
                "relation[delay]": "",
                "commit": "Add"
            },
            headers: {
                "Accept": 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
            },
            success: function (data) {
                if (issueIdsToLink.length === 0) {
                    addFilterButtonToReleatedTasks();
                    return;
                }
                linkRelatedIssues(issueId, issueIdsToLink);
            }
        });

    }

    const addAdditionalFunctionalityButtonsToReleatedTasks = () => {
        var issueId = getCurrentIssueId();
        var relatedIssuesUrlTemplate = '/issues?utf8=✓&set_filter=1&f[]=relates&op[relates]==&v[relates][]=%%ISSUE_ID%%&f[]=&c[]=tracker&c[]=status&c[]=priority&c[]=subject&c[]=assigned_to&c[]=estimated_hours&c[]=spent_hours&c[]=done_ratio&c[]=updated_on&group_by=status&t[]=estimated_hours&t[]=spent_hours';

        // add "Filter" button
        var divLinks = $("#relations > .contextual");
        var relatedIssuesUrl = relatedIssuesUrlTemplate.replace('%%ISSUE_ID%%', issueId);
        divLinks.append(' |<a href="'+relatedIssuesUrl+'">Filter</a>');

        // add only to "release" tracker issues
        if ($('select#issue_tracker_id option:selected').val() == releaseTrackerID) {
            // add "Filter non-RFC" button
            var relatedNonRFCIssuesUrlTemplate = '/issues?utf8=✓&set_filter=1&f[]=relates&op[relates]==&v[relates][]=%%ISSUE_ID%%&f[]=tracker_id&op[tracker_id]=!&v[tracker_id][]=%%ISSUE_TRACKER_ID%%&f[]=&c[]=tracker&c[]=status&c[]=priority&c[]=cf_4&c[]=cf_8&c[]=subject&c[]=assigned_to&c[]=estimated_hours&c[]=spent_hours&c[]=done_ratio&c[]=updated_on&group_by=status&t[]=estimated_hours&t[]=spent_hours';
            var relatedNonRFCIssuesUrl = relatedNonRFCIssuesUrlTemplate.replace('%%ISSUE_ID%%', issueId).replace('%%ISSUE_TRACKER_ID%%', rfcTrackerID);
            divLinks.append(' |<a href="'+relatedNonRFCIssuesUrl+'">Filter non-RFC</a>');

            // highlight RFC relations
            $('a.tracker-'+rfcTrackerID, '#relations').css('background', 'gold').css('font-weight', 'bold');
        }

        // add "Copy related issues" button
        var copiedFrom = $("td:contains('Copied from ')", "#relations");
        if (copiedFrom.length > 0) {
            var copiedFromId = $("[href^='/issues/']", copiedFrom[0]).attr('href').replace('/issues/', '');
            var copyRelatedIssueLink = $('<a/>', {href: '#', 'text': 'Copy related issues', 'title': 'Copies related issues of original "Copied From" issue'});

            var allRelatedIssuesUrl = relatedIssuesUrlTemplate.replace('%%ISSUE_ID%%', copiedFromId);

            copyRelatedIssueLink.click(function(){
                $.get( allRelatedIssuesUrl, function(data) {
                    var loadedHtml = $.parseHTML(data);
                    var idsCheckboxes = $("[name='ids[]']", loadedHtml);
                    var issueIdsToLink = [];
                    idsCheckboxes.each(function(){
                        var relatedIssueId = parseInt($(this).val(), 10);
                        //if not already linked
                        if ($("[href^='/issues/"+relatedIssueId+"']", "#relations").length === 0) {
                            issueIdsToLink.push($(this).val());
                        }
                    });

                    linkRelatedIssues(issueId, issueIdsToLink);
                });

                return false;
            });

            divLinks.append(' |');
            divLinks.append(copyRelatedIssueLink);
        }

    };
    //-------------------------------------------------------------------------------
    const addReleaseRfcUtilityButtons = () => {

        //allow only in "release" or "rfc" trackers
        var issueTrackerId = $('select#issue_tracker_id option:selected').val();
        if (issueTrackerId != rfcTrackerID && issueTrackerId != releaseTrackerID) {
            return;
        }

        var issueId = getCurrentIssueId();
        var gitBranchInput = $('#issue_custom_field_values_12');

        const addCreateBranchButton = function(generateGitBranchNameFunction) {
            var createGitBranchNameLink = $('<a/>', {href: '#', 'text': ' [create branch name]', 'title': 'Fills git branch name', 'css': {'white-space': 'nowrap'}});
            createGitBranchNameLink.click(function(){
                var branchName = generateGitBranchNameFunction();
                if (branchName !== null) {
                    $('#issue_custom_field_values_12').val(generateGitBranchNameFunction());
                    $('#issue-form').submit();
                }

                return false;
            });

            $('.value', '.cf_12').append(createGitBranchNameLink);
        }

        const addDownloadScriptButton = function(downloadScriptFunction) {
            var downloadScriptLink = $('<a/>', {href: '#', 'text': ' [download script]', 'title': 'Creates generic shell script for preparation of branches', 'css': {'white-space': 'nowrap'}});
            downloadScriptLink.click(function(){
                downloadScriptFunction();

                return false;
            });

            $('.value', '.cf_12').append(downloadScriptLink);
        }

        const addSetToNow = function(appendTo, valueField) {
            if (valueField.val() != '') {
                return;
            }

            var setToNowLink = $('<a/>', {href: '#', 'text': ' [set to now]', 'title': 'Sets to current date time in BST timezone', 'css': {'white-space': 'nowrap'}});
            setToNowLink.click(function(){
                var options = {
                    timeZone: 'Europe/London',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                };
                var formatter = new Intl.DateTimeFormat('lt-LT', options);
                valueField.val(formatter.format(new Date()));
                $('#issue-form').submit();

                return false;
            });

            appendTo.append(setToNowLink);
        }

        const getEnvironment = function() {
            var environmentCheckBoxes = $('[name="issue[custom_field_values][62][]"]:checked');
            if (environmentCheckBoxes.length !== 1) {
                alert('One Environment must be selected');
                return null;
            }

            return environmentCheckBoxes.val().toLowerCase();
        }

        const getGitProjects = function() {
            var gitProjectsTemp = $('[name="issue[custom_field_values][13][]"]:checked');
            var gitProjects = [];

            gitProjectsTemp.each(function(){
                gitProjects.push($(this).val().trim());
            });
            gitProjects.sort(function(a, b){return isBundle(b) - isBundle(a)});

            return gitProjects;
        };

        const getAllRelatedIssueBranches = function(issueId, excludedTrackerId, callback, isUsingFakeBranches = false) {
            var allRelatedBranchesUrlTemplate = '/issues?utf8=✓&set_filter=1&f[]=relates&op[relates]==&v[relates][]=%%ISSUE_ID%%&f[]=tracker_id&op[tracker_id]=!&v[tracker_id][]=%%ISSUE_TRACKER_ID%%&f[]=&c[]=cf_12&c[]=cf_13&c[]=cf_14&c[]=cf_25&c[]=cf_26&c[]=cf_8&c[]=subject&per_page=100';
            var allRelatedBranchesUrl = allRelatedBranchesUrlTemplate.replace('%%ISSUE_ID%%', issueId).replace('%%ISSUE_TRACKER_ID%%', excludedTrackerId);

            $.get(allRelatedBranchesUrl, function(data) {
                var projectBranches = {};
                var productBundleUpdates = {};
                var branchDeploymentNotes = {};
                var allIssueIds = [];
                var testedByMap = {};

                var loadedHtml = $.parseHTML(data);
                var issueRows = $("tr.issue", loadedHtml);

                if (issueRows.length == 0) {
                    alert('Error. Release/RFC has no related issues');
                    return;
                }

                var isValid = true;
                issueRows.each(function(){
                    var id = $('.id', $(this)).text().trim();
                    var subject = $('.subject', $(this)).text().trim();
                    var projects = $('.cf_13', $(this)).html().split(',');
                    var branch = $('.cf_12', $(this)).html().trim();
                    var deploymentNotes = $('.cf_14', $(this)).find('p');
                    var mergeRequests = $('.cf_25', $(this)).find('tr');
                    var testedBy = $('.cf_8', $(this)).html().trim();

                    if (!branch) {
                        alert('Error. GIT branch is not set for issue with ID:'+id);
                        if (!isUsingFakeBranches) {
                            isValid = false;

                            return;
                        }
                        branch = 'fake_branch_task_id_'+id;
                    }

                    if (!testedBy) {
                        testedBy = '-';
                    }

                    allIssueIds.push(id);
                    testedByMap[id] = testedBy;

                    var validMergeRequestProjects = [];
                    mergeRequests.each(function(index, value) {
                        var status = $(value).find('td:eq(0)').text().trim();
                        var project = $(value).find('td:eq(1)').text().trim().split(' ')[0];
                        if (status.toLowerCase() != 'closed') {
                            validMergeRequestProjects.push(project);
                        }
                    });

                    var bundles = [];
                    var products = [];
                    projects.forEach(function(item){
                        var project = item.trim();

                        if (!validMergeRequestProjects.includes(project)) {
                            return false;
                        }

                        if (isBundle(project)) {
                            bundles.push(project);
                        } else {
                            products.push(project);
                        }
                        if (!projectBranches.hasOwnProperty(project)) {
                            projectBranches[project] = [];
                        }
                        projectBranches[project].push(branch);
                    });

                    if (deploymentNotes.length > 0) {
                        var deploymentNote = "";
                        deploymentNotes.each(function(){
                            deploymentNote += $(this).html().replace(/<br\s*\/?>/mg,"\n").replace(/(<([^>]+)>)/gi, "").trim()+"\n\n";
                        });
                        branchDeploymentNotes[branch] = {
                            "taskId": id,
                            "taskSubject": subject,
                            "notes": deploymentNote.trim(),
                            "projects": projects
                        };
                    }

                    bundles.forEach(function(bundle){
                        products.forEach(function(product){
                            if (!productBundleUpdates.hasOwnProperty(product)) {
                                productBundleUpdates[product] = {};
                            }
                            productBundleUpdates[product][bundle] = bundle;
                        });
                    });
                });

                if (!isValid) {
                    return;
                }

                callback(projectBranches, productBundleUpdates, branchDeploymentNotes, allIssueIds, testedByMap);
            });
        };

        const isBundle = function(projectName) {
            projectName = projectName.toLowerCase();

            return (projectName.indexOf('bundle-') !== -1) || (projectName.indexOf('ft-') === 0);
        };

        const download = function (filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

        const getGitDetails = function (projectName) {
            var nameMismatchMap = {
                "FT-BUNDLE-DBAPI": "bundle-dbapi",
                "FT-BUNDLE-REDMINE": "bundle-redmine",
                "FT-BUNDLE-CURL": "bundle-curl",
                "FT-BUNDLE-SLACK": "bundle-slack",
                "MISC-PROVIDERBOX": "ft-providerbox",
                "MISC-RISKBOX": "ft-riskbox"
            };

            var namespace = '';
            var project = '';
            if (isBundle(projectName)) {
                namespace = 'bundles';
                project = projectName.toLowerCase();
            } else {
                var temp = projectName.toLowerCase().split('-');
                namespace = temp.shift();
                project = temp.join('-');
            }

            if (nameMismatchMap.hasOwnProperty(projectName)) {
                project = nameMismatchMap[projectName];
            }

            return {
                "namespace": namespace,
                "project": project
            };
        }

        const generateReleaseSnippet = function(releaseBaseBranch, commitType, tagType, isNew) {
            var gitProjects = getGitProjects();
            var releaseID = issueId;

            if (gitProjects.length == 0) {
                alert('No git projects selected');
                return false;
            }

            var releaseBranch = gitBranchInput.val();
            if (releaseBranch == '') {
                alert('Git Branch name is not set');
                return false;
            }

            getAllRelatedIssueBranches(releaseID, rfcTrackerID, function(projectBranches, productBundleUpdates){
                var snippet = '#!/bin/bash\n\n';

                snippet += "echo STEP 1. ================================================================\n";
                snippet += "echo Preparing base for "+commitType+":\n";
                snippet += "echo ========================================================================\n";
                snippet += "mkdir '"+releaseBranch+"'\n";
                snippet += "cd '"+releaseBranch+"'\n";
                snippet += "releaseDir=$(pwd)\n"
                snippet += "echo -e \"\n\" \n\n\n\n\n\n\n";
                gitProjects.forEach(function(project) {
                    var gitDetails = getGitDetails(project);
                    snippet += "echo ------------------------------------------------------------------------\n";
                    snippet += "echo Preparing base for project '"+project+"':\n";
                    snippet += "echo ------------------------------------------------------------------------\n";
                    if (isNew) {
                        snippet += "git clone "+'git@git.tribepayments.com:%%NAMESPACE%%/%%PROJECT%%.git'.replace('%%NAMESPACE%%', gitDetails.namespace).replace('%%PROJECT%%', gitDetails.project)+"\n";
                    }
                    snippet += "cd "+gitDetails.project+" \n";
                    snippet += "git fetch --all \n";
                    snippet += "baseBranchOn=\""+releaseBaseBranch+"\" \n";
                    if (commitType == 'rfc' && isBundle(project)) {
                        snippet += "read -p \"This is a bundle ("+project+". Please enter a version tag/branch on which current branch should be based on (a version currently used in the target environment) and PRESS ENTER >\" baseBranchOn\n";
                        //TODO loop through all the projects using this bundle, check pre/sand/live branch and take the highest version tag from there
                    }
                    snippet += "until git checkout -b "+releaseBranch+" $baseBranchOn --; do read -p \"Please enter a VALID tag/branch on which current branch should be based on and PRESS ENTER >\" baseBranchOn; done \n";

                    snippet += "git checkout "+releaseBranch+" || git checkout -b "+releaseBranch+"\n";
                    snippet += "git commit --allow-empty -m \"#"+releaseID+" "+commitType+"\"\n";

                    snippet += "cd \"${releaseDir}\"\n";
                    snippet += "echo -e \"\n\" \n\n\n\n\n\n\n";
                });
                snippet += "echo -e \"\n\n\n\" \n\n\n\n\n\n\n";

                snippet += "echo STEP 2. ================================================================\n";
                snippet += "echo Merging tasks into "+commitType+":\n";
                snippet += "echo ========================================================================\n\n\n\n\n\n\n";

                gitProjects.forEach(function(project) {
                    var gitDetails = getGitDetails(project);

                    snippet += "echo ------------------------------------------------------------------------\n";
                    snippet += "echo MERGING TASKS FOR "+(isBundle(project) ? "BUNDLE" : "PRODUCT")+" "+project+": \n";
                    snippet += "echo ------------------------------------------------------------------------\n";
                    snippet += "cd \"${releaseDir}\"\n";
                    snippet += "cd "+gitDetails.project+" \n";
                    snippet += "git fetch --all \n";

                    if (projectBranches.hasOwnProperty(project)) {
                        projectBranches[project].forEach(function(taskBranch){
                            snippet += "git merge origin/"+taskBranch+" || read -p \"Merge branch 'origin/"+taskBranch+"' manually and PRESS ENTER\" \n";
                            snippet += "conflicts=$(git ls-files -u | wc -l) \n";
                            snippet += "if [ \"$conflicts\" -gt 0 ]; then git merge --abort; read -p \"Merge branch 'origin/"+taskBranch+"' manually and PRESS ENTER\"; fi \n";
                            snippet += "echo -e \"\n\" \n";
                        });
                    }

                    snippet += "echo -e \"Check composer.json if no 'dev-*' versions are left\n\"\n";
                    snippet += "echo -e \"\n\" \n";
                    snippet += "cat composer.json | grep \"dev-\"\n";
                    if (commitType == 'rfc') {
                        snippet += "cat composer.json | grep \"alpha-\"\n";
                    }
                    snippet += "echo -e \"\n\" \n";
                    snippet += "read -p \"If no invalid dev-* references are present -  PRESS ENTER\"\n";
                    snippet += "echo -e \"\n\" \n";

                    if (isBundle(project)) {
                        snippet += "newTag=''\n";
                        snippet += "suggestedTag=''\n";
                        snippet += "currentTag=$(git describe --tags --abbrev=0)\n";
                        snippet += "echo \"NEW TAG FOR BUNDLE '"+project+"' is needed. Name it in the following pattern 'vX.Y.Z-"+tagType+issueId+"00' latest tag on branch: '${currentTag}'\"\n";

                        snippet += "re='(([[:digit:]]+)\.([[:digit:]]+)\.([[:digit:]]+))'\n";
                        snippet += "[[ \"$currentTag\" =~ $re ]] \n";
                        snippet += "if [ -n \"${BASH_REMATCH[1]}\" ]; then buildNumber=$((${BASH_REMATCH[4]}+"+(commitType == 'rfc'?"0":"1")+")); suggestedTag=\"v${BASH_REMATCH[2]}.${BASH_REMATCH[3]}.${buildNumber}-"+tagType+issueId+"00\"; fi \n";
                        snippet += "useSuggestedTag='N'\n";
                        snippet += "if [ -n \"$suggestedTag\" ]; then read -p \"Use suggested Tag: ${suggestedTag} Y/N >\"  useSuggestedTag; fi \n";
                        snippet += "if [ ${useSuggestedTag,,} == \"y\" ]; then newTag=$suggestedTag; fi \n";
                        snippet += "until [ -n \"$newTag\" ]; do read -p \"Please enter a new tag for this bundle. Name it in the following pattern 'vX.Y.Z-"+tagType+issueId+"00' and PRESS ENTER >\" newTag; done \n";

                        snippet += "git tag ${newTag} \n";
                        snippet += "echo -e \"\n\" \n";
                    }

                    snippet += "read -p \"push project (navigate to '$(pwd)' and execute 'git push && git push --tags') and PRESS ENTER\"\n";
                    snippet += "echo -e \"\n\" \n";
                    snippet += "echo -e \"\\n\\n\\n\\n\"\n\n\n\n\n\n\n";
                });
                download('create-'+commitType+'-'+releaseID+'.sh', snippet);
            });
        };

        //ADD: GIT projects:[check missing]
        var checkGitProjects = $('<a/>', {href: '#', 'text': ' [check missing]', 'title': 'Check selected git projects', 'css': {'white-space': 'nowrap'}});
        checkGitProjects.click(function(){
            getAllRelatedIssueBranches(issueId, rfcTrackerID, function(projectBranches, productBundleUpdates){
                var selectedProjects = getGitProjects();
                var missingProjects = [];
                for (var project in projectBranches) {
                    if (!selectedProjects.includes(project)) {
                        missingProjects.push(project);
                    }
                }

                if (missingProjects.length > 0) {
                    if (confirm("GIT projects not selected. Add these projects? \n\n"+missingProjects.join("\n"))) {
                        missingProjects.forEach(function(missingProject){
                            $('[name="issue[custom_field_values][13][]"][value="'+missingProject+'"]').prop('checked', 'true');
                        });
                        $('#issue-form').submit();
                    }
                } else {
                    alert('All GIT projects are selected');
                }

            });

            return false;
        });
        $('.value', '.cf_13').append(checkGitProjects);

        //ADD: GIT projects: [download branch list]
        var downloadBranchList = $('<a/>', {href: '#', 'text': ' [download branch list]', 'title': 'Download list of branches per project', 'css': {'white-space': 'nowrap'}});
        downloadBranchList.click(function(){
            getAllRelatedIssueBranches(issueId, rfcTrackerID, function(projectBranches, productBundleUpdates){
                var branchList = "";
                var gitProjects = getGitProjects();
                gitProjects.forEach(function(project) {
                    branchList += "========================================================================\n";
                    branchList += "Branches to merge for project "+project+":\n";
                    branchList += "========================================================================\n";
                    if (projectBranches.hasOwnProperty(project)) {
                        projectBranches[project].forEach(function(branch) {
                            branchList += branch+"\n";
                        });
                    } else {
                        branchList += "WARNING! NO BRANCHES FOUND.\n";
                    }
                    branchList += "\n\n\n";
                });
                download("branch-list-"+issueId+".txt", branchList);
            });

            return false;
        });
        $('.value', '.cf_13').append(downloadBranchList);

        //ADD: GIT projects: [download task ID list]
        if (issueTrackerId == releaseTrackerID) {

            var downloadTaskIDList = $('<a/>', {href: '#', 'text': ' [download task ID list]', 'title': 'Download list of task IDs', 'css': {'white-space': 'nowrap'}});
            downloadTaskIDList.click(function(){
                getAllRelatedIssueBranches(
                    issueId,
                    rfcTrackerID,
                    function(projectBranches, productBundleUpdates, deploymentNotes, taskIds, taskToTesterMap){
                        var taskIdList = "";
                        taskIds.sort();

                        taskIdList += "========================================================================\n";
                        taskIdList += "All IDs:\n";
                        taskIdList += "========================================================================\n"
                        taskIds.forEach(function(taskId) {
                            taskIdList += "#"+taskId+":\n";
                        });
                        taskIdList += "\n\n\n";

                        taskIdList += "========================================================================\n";
                        taskIdList += "All IDs with assigned tester:\n";
                        taskIdList += "========================================================================\n"
                        taskIds.forEach(function(taskId) {
                            taskIdList += "#"+taskId+" ("+(taskToTesterMap[taskId] ? taskToTesterMap[taskId] : '-')+"):\n";
                        });
                        taskIdList += "\n\n\n";

                        taskIdList += "========================================================================\n";
                        taskIdList += "All IDs grouped by the assigned tester:\n";
                        taskIdList += "========================================================================\n\n"

                        var tasksByTester = {};
                        for (var taskId in taskToTesterMap) {
                            var tester = taskToTesterMap[taskId];
                            if (!tasksByTester.hasOwnProperty(tester)) {
                                tasksByTester[tester] = [];
                            }
                            tasksByTester[tester].push(taskId);
                        }

                        for (var testedBy in tasksByTester) {
                            tasksByTester[testedBy].sort();
                            taskIdList += "----------\n";
                            taskIdList += "Tested By: "+testedBy+":\n";
                            taskIdList += "----------\n";
                            tasksByTester[testedBy].forEach(function(taskId) {
                                taskIdList += "#"+taskId+":\n";
                            });
                            taskIdList += "\n";
                        }

                        download("task-id-list-"+issueId+".txt", taskIdList);
                    },
                    true
                );

                return false;
            });
            $('.value', '.cf_13').append(downloadTaskIDList);
        }

        //ADD: GIT branch:[create branch name]
        if (gitBranchInput.val() === '') {
            if (issueTrackerId == releaseTrackerID) {
                addCreateBranchButton(function() {
                    return 'release_%%ISSUE_ID%%'.replace('%%ISSUE_ID%%', issueId);
                });
            }

            if (issueTrackerId == rfcTrackerID) {
                addCreateBranchButton(function() {
                    var environmentCheckBoxes = $('[name="issue[custom_field_values][62][]"]:checked');
                    if (environmentCheckBoxes.length !== 1) {
                        alert('One Environment must be selected');
                        return null;
                    }

                    var environment = environmentCheckBoxes.val().toLowerCase();

                    return 'rfc_%%ISSUE_ID%%_%%ENVIRONMENT%%'.replace('%%ISSUE_ID%%', issueId).replace('%%ENVIRONMENT%%', environment);
                });
            }
        }

        //ADD GIT branch:[download script]
        if (gitBranchInput.val() !== '') {
            if (issueTrackerId == releaseTrackerID) {
                addDownloadScriptButton(function() {
                    generateReleaseSnippet("origin/master^0", "release", "alpha", true);
                });
            }

            if (issueTrackerId == rfcTrackerID) {
                addDownloadScriptButton(function() {
                    generateReleaseSnippet("origin/"+getEnvironment()+"^0", "rfc", "RC", true);
                });
            }
        }

        //ADD: GIT projects: [compare branch tasks]
        if (gitBranchInput.val() !== '' && issueTrackerId == releaseTrackerID) {
            var compareBranchTasks = $('<a/>', {href: '#', 'text': ' [compare product branch tasks]', 'title': 'Compare branch tasks', 'css': {'white-space': 'nowrap'}});
            compareBranchTasks.click(function(){
                var gitProjects = getGitProjects();

                if (gitProjects.length == 0) {
                    alert('No git projects selected');
                    return false;
                }

                var releaseBranch = gitBranchInput.val();
                if (releaseBranch == '') {
                    alert('Git Branch name is not set');
                    return false;
                }

                var namespaces = [];
                gitProjects.forEach(function(project) {
                    if (!isBundle(project)) {
                        var gitDetails = getGitDetails(project);
                        namespaces.push(gitDetails.namespace+"/"+gitDetails.project);
                    }
                });

                window.open(branchCompareUrl.replace('%%RELEASE_BRANCH%%', releaseBranch).replace('%%ENCODED_PROJECT_NAMESPACES%%', encodeURIComponent(btoa(namespaces.join(',')))), "_blank");

                return false;
            });
            $('.value', '.cf_12').append(compareBranchTasks);
        }

        //ADD Status:[generate change plan]
        if (issueTrackerId == releaseTrackerID) {
            var changePlanInput = $('#issue_custom_field_values_90');

            var createChangePlan = $('<a/>', {href: '#', 'text': ' [generate plan]', 'title': 'Creates generic change plan by compiling deployment notes from related tasks', 'css': {'white-space': 'nowrap'}});
            createChangePlan.click(function() {
                getAllRelatedIssueBranches(issueId, rfcTrackerID, function(projectBranches, productBundleUpdates, branchDeploymentNotes) {
                    if ($.isEmptyObject(branchDeploymentNotes)) {
                        alert("No deployment notes found in the related tasks");
                        return false;
                    }

                    var changePlan = '';
                    for (const taskBranch in branchDeploymentNotes) {
                        changePlan += "===================================\n";
                        changePlan += "#"+branchDeploymentNotes[taskBranch]['taskId']+" "+branchDeploymentNotes[taskBranch]['taskSubject']+" (branch:"+taskBranch+") related projects ("+branchDeploymentNotes[taskBranch].projects.join(",")+")\n\n";
                        changePlan += "===================================\n";
                        changePlan += "<pre>"+branchDeploymentNotes[taskBranch].notes +"</pre>\n";
                        changePlan += "\n\n\n";
                    }

                    if (confirm("Change plan generated. Set as a change plan? \n\n"+changePlan)) {
                        if (changePlanInput.val() !== '') {
                            if (confirm("Are you sure? Currently set change plan will be replaced")) {
                                $('#issue_custom_field_values_90').val(changePlan);
                                $('#issue-form').submit();
                            }
                        } else {
                            $('#issue_custom_field_values_90').val(changePlan);
                            $('#issue-form').submit();
                        }
                    }
                });

                return false;
            });

            $('.value', '.status').append(createChangePlan);
        }

        //ADD Actual start/end date: [set to now]
        if (issueTrackerId == rfcTrackerID) {
            addSetToNow($('.value', '.cf_86'), $('#issue_custom_field_values_86'));
            addSetToNow($('.value', '.cf_87'), $('#issue_custom_field_values_87'));
        }

        //Add generate subject
        var generateSubject = function() {
            var subject = "";

            var changeCategory = $('#issue_custom_field_values_82').val();
            if (changeCategory == "") {
                alert('Please choose "Change category"');
                return false;
            }

            var productsAffectedCheckBoxes = $('[name="issue[custom_field_values][66][]"]:checked');
            if (productsAffectedCheckBoxes.length === 0 || (productsAffectedCheckBoxes.length === 1 && productsAffectedCheckBoxes.val() === "-UNKNOWN-")) {
                alert('Please choose "Products affected"');
                return false;
            }

            var affectedProducts = [];
            productsAffectedCheckBoxes.each(function() {
                affectedProducts.push($(this).val());
            });

            var trackerId = $('#issue_tracker_id').val();
            if (trackerId === releaseTrackerID) {
                var dueDate = $('#issue_due_date').val();
                if (dueDate == "") {
                    alert('Please choose "Due date"');
                    return false;
                }

                subject = changeCategory+": "+affectedProducts.join(', ')+" "+dueDate;
            }

            if (trackerId === rfcTrackerID) {
                var plannedDate = $('#issue_custom_field_values_83').val();
                if (plannedDate == "") {
                    alert('Please choose "Planned date"');
                    return false;
                }

                var environmentCheckBoxes = $('[name="issue[custom_field_values][62][]"]:checked');
                if (environmentCheckBoxes.length === 0) {
                    alert('Please choose "Environment"');
                    return false;
                }

                var environments = [];
                environmentCheckBoxes.each(function() {
                    environments.push($(this).val());
                });

                subject = "["+environments.join(', ')+"] "+changeCategory+": "+affectedProducts.join(', ')+" "+plannedDate;
            }

            if (subject != "") {
                if (confirm("Set the subject to "+subject+"?")) {
                    $('#issue_subject').val(subject);
                    return true;
                }
            }

            return false;
        };

        var addGenerateSubjectButton = function() {
            var createSubjectLink = $('<a/>', {href: '#', 'text': ' [generate subject] ', 'title': 'generates subject and sets it to the form field', 'css': {'white-space': 'nowrap'}});
            createSubjectLink.click(function(){
                generateSubject();
                return false;
            });

            if (!issueId) {
                var subjectFormField = $('#issue_subject');
                subjectFormField.prop('readonly', true);
                subjectFormField.prop('placeholder', 'For a new ticket this field can be only autogenerated');
            }

            $('#issue_subject').parent().prepend(createSubjectLink);
        }

        if (!issueId) {
            var issueForm = $('#issue-form');
            issueForm.submit(function(e){
                e.preventDefault();
                if (generateSubject()) {
                    this.submit();
                }
                return false;
            });
        }

        addGenerateSubjectButton();
        var currentTrackerId = $('#issue_tracker_id').val();
        $("body").on('DOMSubtreeModified', "#all_attributes", function() {
            var newTracker = $('#issue_tracker_id');
            if (newTracker.length > 0 && newTracker.val() != currentTrackerId) {
                currentTrackerId = newTracker.val();
                setTimeout(function() { addGenerateSubjectButton(); }, 100);

            }
        });
    };
    //-------------------------------------------------------------------------------
    const importantTaskList = () => {
        var item = $('#content h2').text().replace(/\D+/g, '');
        var existingEntries = JSON.parse(localStorage.getItem("taskids")) || [];

        if (item) {
            var found = false;
            $.each(existingEntries, function(k,v){
                if(item == v.id) {
                    $('#content .contextual:first').prepend('<a id="remove_from_important_list" style="cursor:pointer">- Remove from list</a> |');
                    found = true;
                }
            });

            if (!found) {
                $('#content .contextual:first').prepend('<a id="add_to_important_list" style="cursor:pointer">+ Add to list</a> |');
            }
        }

        $('#add_to_important_list').click(function(){
            if (typeof(Storage) !== "undefined") {
                var desc = $('.subject h3').text();
                var itemFound = false;
                $.each(existingEntries, function(k,v){
                    if(item == v.id) {
                        itemFound = true;
                    }
                });

                if(!itemFound){
                    existingEntries.push({id:item,desc:desc});
                    localStorage.setItem('taskids', JSON.stringify(existingEntries));
                    drawTable();
                }
            }
        });

        $('#remove_from_important_list').click(function(){
            if (typeof(Storage) !== "undefined") {
                var itemFound = false;
                var newArray = [];
                $.each(existingEntries, function(k,v){
                    if(item != v.id) {
                        newArray.push(v);
                    }
                });

                localStorage.setItem('taskids', JSON.stringify(newArray));
                drawTable();

            }
        });

        drawTable();

        function drawTable(){
            if (typeof(Storage) !== "undefined") {
                var existingEntries = JSON.parse(localStorage.getItem("taskids")) || [];
                var html = '<div id="important_tasks_list"><h3>Tasks:</h3>';
                $.each(existingEntries, function(k,v){
                    html += '<a href="https://redmine.tribepayments.com/issues/'+v.id+'">#'+v.id+' - '+v.desc+'</a><br>';
                });
                html += '</div>';
                $('#sidebar #important_tasks_list').remove();
                $('#sidebar').append(html);
            }
        }
    };
    //-------------------------------------------------------------------------------
    const watcherIssues = () => {
        // select watched tab when filtering issues by watcher_id
        var watcherClass = '';
        if (window.location.href.indexOf("watcher_id") > -1) {
            $('#main-menu .issues').removeClass('selected');
            watcherClass = 'selected';
        }

        var watcherUrl = $('.overview')[0].href+'/issues?utf8=%E2%9C%93&set_filter=1&f%5B%5D=status_id&op%5Bstatus_id%5D=o&f%5B%5D=watcher_id&op%5Bwatcher_id%5D=%3D&v%5Bwatcher_id%5D%5B%5D=me&f%5B%5D=&c%5B%5D=tracker&c%5B%5D=status&c%5B%5D=priority&c%5B%5D=subject&c%5B%5D=assigned_to&c%5B%5D=estimated_hours&c%5B%5D=spent_hours&c%5B%5D=done_ratio&c%5B%5D=updated_on&group_by=status&t%5B%5D=estimated_hours&t%5B%5D=spent_hours'
        var watcherHtml = '<li><a class="'+watcherClass+'" href="'+watcherUrl+'">Watcher</a></li>';
        $('#main-menu .issues').parent().after(watcherHtml);
    };
    //-------------------------------------------------------------------------------
    const assignedTasksByEmployee = () => {
        // comment/uncomment statuses to modify what types of tasks want to view
        var statuses = [
//        12, // Pending Approval
            11, // Not approved
            1,  // New
            2,  // In progress
//        3, // Resolved
            4, // Feedback
//        5, // Closed
//        6, // Rejected
//        7 // Suspended
        ];

        var assignee = $('.attributes .assigned-to.attribute .user.active');
        if (!assignee || !assignee.attr('href')) {
            return;
        }

        var userId = assignee.attr('href').replace('/users/','');

        var stats = '';
        $.each(statuses, function(k,v){
            stats += 'v%5Bstatus_id%5D%5B%5D='+v+'&';
        });

        var link_tasks = $('.overview')[0].href+'/issues?utf8=%E2%9C%93&set_filter=1&sort=priority%3Adesc%2Cid%3Adesc&f%5B%5D=status_id&op%5Bstatus_id%5D=%3D&'+stats+'f%5B%5D=assigned_to_id&op%5Bassigned_to_id%5D=%3D&v%5Bassigned_to_id%5D%5B%5D='+userId+'&f%5B%5D=&group_by=';
        assignee.after(' | <a style="color:red" target="_blank" href="'+link_tasks+'">tasks</a>');

        var spent_time_div = $('.spent-time .value .count');
        if (!spent_time_div) {
            return;
        }

        var link_time = $('.overview')[0].href+'/time_entries?utf8=%E2%9C%93&set_filter=1&sort=spent_on%3Adesc&f%5B%5D=user_id&op%5Buser_id%5D=%3D&v%5Buser_id%5D%5B%5D='+userId+'&f%5B%5D=spent_on&op%5Bspent_on%5D=w&f%5B%5D=&c%5B%5D=spent_on&c%5B%5D=user&c%5B%5D=activity&c%5B%5D=issue&c%5B%5D=comments&c%5B%5D=hours&group_by=&t%5B%5D=hours&t%5B%5D=';
        spent_time_div.after(' | <a style="color:green" target="_blank" href="'+link_time+'">tasks</a>');
    };
    //-------------------------------------------------------------------------------
    const customSubjectPrefill = () => {
        const subjects = {
            bank: [
                'BANK: ',
                'BANK-DOC: ',
                'BANKBOX: ',
                'BANKWIRE: ',
                'MONITOR-BANK: ',
            ],
            gateway: [
                'GTW: ',
                'GTW-DOC: ',
                'GTW-SUPPORT: ',
                'GTW-2-ISAC: ',
                'MONITOR-GTW: ',
            ],
            isac: [
                'ISAC: ',
                'ISAC-DOC: ',
                'ISAC-IS-: ',
                'ISAC-AC-: ',
                'ISAC-REPORTS: ',
                'MONITOR-ISAC: ',
            ],
            wallet: [
                'WAL-MISC: ',
                'WAL-MISC-MOB: ',
                'WAL-DOC: ',
                'WAL-ACCOUNTING: ',
                'WAL-DESIGN-NEW: ',
                'WAL-FAPI: ',
                'WAL-MAPI: ',
                'WAL-IBAN: ',
                'MONITOR-UPC: ',
            ],
            internal: [
                'DEVOPS: ',
            ],
            'support-old': [
                'ISAC-ISS-MISC: ',
                'ISAC-ISS-CREDS: ',
                'ISAC-ISS-PERMS: ',
                'ISAC-ISS-LIVE: ',
                'ISAC-ACQ-MISC: ',
                'ISAC-ACQ-CREDS: ',
                'ISAC-ACQ-PERMS: ',
                'ISAC-ACQ-LIVE: ',
            ]
        };

        const customSubjects = subjects[window.location.pathname.split('/')[2]] || [];
        const defaultSubject = customSubjects[0] || ''; // Default subject for all new tasks

        if (customSubjects.length) {
            var subjectField = $('#issue_subject');
            var all_attributes = $('#all_attributes');
            var custSubjects = $('<p id="custom-subjects-div">');
            custSubjects.append('<label for="custom-subjects">Custom Subjects Prefill: </label>');

            $.each( customSubjects, function( key, subject ) {
                var btn = $('<input type="button" value="'+subject+'">');
                btn.click(function(){
                    subjectField.val($(this).val());
                });
                custSubjects.append(btn);
            });
            all_attributes.prepend(custSubjects);
            subjectField.val(defaultSubject); // Default subject
        }

    };
    //-------------------------------------------------------------------------------
    const userEdit = () => {
        $('#send_information').attr('checked',false);
        $('#user_mail_notification').val($('#user_mail_notification option:last-child').val());
    };
    //-------------------------------------------------------------------------------
    const gitProjectsSearch = () => {
        let activeSearch = '';
        function addStatusChangeEvent() {
            $('#issue_status_id').on('change', function () {
                setTimeout(function () {
                    addSearch();
                    addStatusChangeEvent();
                }, 1000)
            });
        }
        addSearch();
        addStatusChangeEvent();
        function addSearch() {
            let allMultiSelects = $('.list_cf.check_box_group');
            allMultiSelects.each(function (i, el) {
                let multiselect = $(el);
                var customSearch = $("<input>", {"type": "text", "class": "custom-search-input", "placeholder": "Search...", "style": "width: 100%; max-width: 100%;"});
                multiselect.prepend(customSearch);
                customSearch.val(activeSearch);
                filterProjects(multiselect, activeSearch);

                customSearch.on('input', function (e) {
                    let searchText = $(e.target).val();
                    if (searchText === '') {
                        showAllProjects(multiselect);
                    } else {
                        filterProjects(multiselect, searchText);
                    }
                });
            });
        }
        function showAllProjects(multiselect) {
            $('label', multiselect).show();
        }
        function filterProjects(multiselect, search) {
            activeSearch = search;
            let allProjectsInputs = $('label input', multiselect);
            allProjectsInputs.each(function (i, el) {
                let element = $(el);
                if (element.val().toLowerCase().indexOf(search.toLowerCase()) === -1) {
                    element.parent().hide();
                } else {
                    element.parent().show();
                }
            });
        }
    };
    //-------------------------------------------------------------------------------
    const queryProjectUrlFix = () => {
        var queries = $('.queries .query');
        queries.each(function() {
            var target_project = $(this).text().split(' |p:')[1];
            if (target_project){
                // replace current project in URL
                var url = $(this).attr('href');
                var url_parts = url.split('/projects/')
                var new_url = (url_parts.length == 1)
                    ? '/projects/'+target_project+'/'+url
                    : url_parts[0]+'/projects/'+target_project+'/'+url_parts[1].split('/')[1];
                $(this).attr('href', new_url);

                // also remove markup from label
                $(this).text($(this).text().replace(' |p:'+target_project, ''));
            }
        });
    };
    //-------------------------------------------------------------------------------
    const queryProjectUrlFixTitle = () => {
        var title = $('#content H2');
        var pos = title.text().indexOf(' |p:');
        if (pos >= 0){
            title.text(title.text().substr(0,pos));
        }
    };
    //------ END Functionality handlers ---------------------------------------------

    const router = [
        {
            regexp: /^(\/projects\/(.+))?\/issues/,
            route: issuesHighlighter,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^(\/projects\/(.+))?\/issues/,
            route: issuesGroupsTimes,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^(\/projects\/(.+))?\/issues/,
            route: calculateFeedbackRatio,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /tags\/new$/,
            route: autofillTagDateTime,
            hostname: 'git.tribepayments.com',
        },
        {
            regexp: /^\/projects\/(.+)\/issues\/(.+)\/copy$/,
            route: untickCopyCheckboxes,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/projects\/(.+)\/issues\/new$/,
            route: prefillDefaultValues,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/(.+\/)?issues\/(.+)/,
            route: addFilterHideClosedButtonsToSubtasks,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/(.+\/)?issues\/(.+)/,
            route: addAdditionalFunctionalityButtonsToReleatedTasks,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/(.+\/)?issues\/(.+)/,
            route: addReleaseRfcUtilityButtons,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/issues/,
            route: issueTimes,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/(.+\/)?issues\/(.+)/,
            route: importantTaskList,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/(projects|issues)\/.+/,
            route: watcherIssues,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/issues\/.+/,
            route: assignedTasksByEmployee,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/projects\/(.+)\/issues\/new/,
            route: customSubjectPrefill,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^(\/issues\/.+|\/projects\/(.+)\/issues\/new)/,
            route: gitProjectsSearch,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/users\/(.+)\/edit/,
            route: userEdit,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^(\/projects\/(.+))?\/issues/,
            route: queryProjectUrlFix,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^(\/projects\/(.+))?\/issues/,
            route: queryProjectUrlFixTitle,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/projects\/support-old\/issues\/new$/,
            route: prefillDefaultValuesSupport,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/issues\/.+/,
            route: slackIssueSummary,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/projects\/support\/issues.*$/,
            route: prepareSupportTaskList,
            hostname: 'redmine.tribepayments.com',
        },
        {
            regexp: /^\/projects\/support\/issues\/new$/,
            route: prepareNewSupportTask,
            hostname: 'redmine.tribepayments.com',
        },
    ];

    // Identify route and run code
    for (let route of router) {
        if (route.hostname === window.location.hostname && route.regexp.test(window.location.pathname)) {
            // console.log(`REGEXP ${route.regexp.toString()} matches - calling ${route.route.name}`);
            route.route();
        }
    }
})(window);
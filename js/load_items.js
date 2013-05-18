var re_priority = /^\(([A-Z])\)\s/;
var re_context = /\s(@[a-z]+)/;
var re_project = /\s(\+[a-z]+)/;

var header_html = "<tr>"
    + "<th class=\"priority\">Priority</th>"
    + "<th class=\"task\">Task</th>"
    + "<th class=\"project\">Project</th></tr>"

// todo list
function parse_todo_item(str) {
    var priority = str.match(re_priority);
    var context = str.match(re_context);
    var project = str.match(re_project);
    return {
        priority: priority ? priority[1] : null,
        context: context ? context[1] : null,
        project: project ? project[1] : null,
        data: str
            .replace(re_priority, "")
            .replace(re_context, "")
            .replace(re_project, "")
            .trim()
    };
}

function compare_strings(a, b) {
    if (a == b) return 0;
    else if (a > b) return 1;
    else return -1;
}

function compare_by_priority(a, b) {
    return compare_strings(a.priority, b.priority);
}

function item_to_table_row(item) {
    return "<tr><td>"
        + item.priority + "</td><td>"
        + item.data + "</td><td>"
        + (item.project ? item.project : "") + "</td></tr>";
}

function write_todo_items(context, data) {
    var item_strings = data.trim().split("\n");
    var rows_html = item_strings
        .map(parse_todo_item)
        .filter(function(item) {return item.priority != null})
        .filter(function(item) {return item.context == ("@" + context)})
        .sort(compare_by_priority)
        .map(function(item) {return item_to_table_row(item)})
        .reduce(function(acc, item) {return acc + item }, "");
    table_html = "<table class=\"items\">" + header_html + rows_html + "</table>";
    var title_html = "<p>Todo @" + context + "</p>";
    var todo_html = title_html + table_html;
    $("div#todo").html(todo_html);
}

function load_todo(context) {
    $.ajax({
        url: "data/todo.txt",
        dataType: "text",
        mimeType: "text/plain",
        success: function(data) {write_todo_items(context, data)}
    });
}

// projects
function write_projects(context, data) {
    var project_list = data[context];
    var items_html = project_list
        .map(function(item) {return "<li>" + item + "</li>"})
        .reduce(function(acc, item) {return acc + item}, "");
    var list_html = "<ul>" + items_html + "</ul>";
    var title_html = "<p>Projects @" + context + "</p>";
    var projects_html = title_html + list_html;
    $("div#projects").html(projects_html);
}

function load_projects(context) {
    $.ajax({
        url: "data/projects.json",
        dataType: "json",
        success: function(data) {write_projects(context, data)}
    });
}

// notes
function write_notes(context, data) {
    var notes_list = data[context];
    var items_html = notes_list
        .map(function(item) {return "<li>" + item + "</li>"})
        .reduce(function(acc, item) {return acc + item}, "");
    var list_html = "<ul>" + items_html + "</ul>";
    var title_html = "<p>Notes</p>";
    var notes_html = title_html + list_html;
    $("div#notes").html(notes_html);
}

function load_notes(context) {
    $.ajax({
        url: "data/notes.json",
        dataType: "json",
        success: function(data) {write_notes(context, data)}
    });
}

// entry point
$(document).ready(function() {
    // Extract the "#foo" from the end of the url; if none, default to "home".
    var hash = window.location.hash;
    var context = hash.indexOf("#") != -1 ? hash.substring(1) : "home";
    load_todo(context);
    load_projects(context);
    load_notes(context);
})

---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: false
classes: wide
---

Selected publications and research outputs.

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
classes: wide
---

Peer-reviewed publications in AI, deep learning, medical imaging, and circuit design.

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

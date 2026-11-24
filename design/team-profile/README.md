# "Meet the team" profile form

Fillable PDF that team members fill in for the About page (`/about/`). Two pages, 15 fields, all optional, approval
boxes at the end; photos are sent by email to hello@sogilex.com.

Rebuild (from the repo root):

```
python3 design/team-profile/make_profile_pdf.py /tmp/profile-raw.pdf design/logos/sogilex-logo-for-dark-backgrounds.png
python3 -c "from pypdf import PdfWriter; w=PdfWriter(clone_from='/tmp/profile-raw.pdf'); w.set_need_appearances_writer(True); w.write('design/team-profile/Sogilex-Team-Profile.pdf')"
```

The second step sets NeedAppearances so Mac Preview and phone apps draw the boxes and typed answers. Text boxes allow
200 characters (multi-line: 1,000). Open it in Acrobat Reader, Preview or Chrome; in-app previews are not fillable.

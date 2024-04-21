import React from "react";

export interface StyleguideProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

const Styleguide = ({ children, ...rest }: StyleguideProps) => {
  return (
    <div {...rest}>
      <div>
        <div
          data-h2-background="base:children[>div](background)"
          data-h2-display="base(grid) base:children[>div>div](grid)"
          data-h2-grid-template-columns="base(1fr 1fr) base:children[>div>div](1fr 1fr 1fr 1fr 1fr 1fr 1fr)"
          data-h2-gap="base:children[>div>div](x1)"
          className="my-6"
          data-h2-padding="base:children[>div>div](x1) base:children[>div>div>div](x1, 0)"
          data-h2-width="base:children[>div>div>div](100%)"
        >
          <div data-h2="light">
            <div>
              <div data-h2-background="base(primary.lightest)" />
              <div data-h2-background="base(primary.lighter)" />
              <div data-h2-background="base(primary.light)" />
              <div data-h2-background="base(primary)" />
              <div data-h2-background="base(primary.dark)" />
              <div data-h2-background="base(primary.darker)" />
              <div data-h2-background="base(primary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(secondary.lightest)" />
              <div data-h2-background="base(secondary.lighter)" />
              <div data-h2-background="base(secondary.light)" />
              <div data-h2-background="base(secondary)" />
              <div data-h2-background="base(secondary.dark)" />
              <div data-h2-background="base(secondary.darker)" />
              <div data-h2-background="base(secondary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(tertiary.lightest)" />
              <div data-h2-background="base(tertiary.lighter)" />
              <div data-h2-background="base(tertiary.light)" />
              <div data-h2-background="base(tertiary)" />
              <div data-h2-background="base(tertiary.dark)" />
              <div data-h2-background="base(tertiary.darker)" />
              <div data-h2-background="base(tertiary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(quaternary.lightest)" />
              <div data-h2-background="base(quaternary.lighter)" />
              <div data-h2-background="base(quaternary.light)" />
              <div data-h2-background="base(quaternary)" />
              <div data-h2-background="base(quaternary.dark)" />
              <div data-h2-background="base(quaternary.darker)" />
              <div data-h2-background="base(quaternary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(quinary.lightest)" />
              <div data-h2-background="base(quinary.lighter)" />
              <div data-h2-background="base(quinary.light)" />
              <div data-h2-background="base(quinary)" />
              <div data-h2-background="base(quinary.dark)" />
              <div data-h2-background="base(quinary.darker)" />
              <div data-h2-background="base(quinary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(foreground.lightest)" />
              <div data-h2-background="base(foreground.lighter)" />
              <div data-h2-background="base(foreground.light)" />
              <div data-h2-background="base(foreground)" />
              <div data-h2-background="base(foreground.dark)" />
              <div data-h2-background="base(foreground.darker)" />
              <div data-h2-background="base(foreground.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(background.lightest)" />
              <div data-h2-background="base(background.lighter)" />
              <div data-h2-background="base(background.light)" />
              <div data-h2-background="base(background)" />
              <div data-h2-background="base(background.dark)" />
              <div data-h2-background="base(background.darker)" />
              <div data-h2-background="base(background.darkest)" />
            </div>
          </div>
          <div data-h2="dark">
            <div>
              <div data-h2-background="base(primary.lightest)" />
              <div data-h2-background="base(primary.lighter)" />
              <div data-h2-background="base(primary.light)" />
              <div data-h2-background="base(primary)" />
              <div data-h2-background="base(primary.dark)" />
              <div data-h2-background="base(primary.darker)" />
              <div data-h2-background="base(primary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(secondary.lightest)" />
              <div data-h2-background="base(secondary.lighter)" />
              <div data-h2-background="base(secondary.light)" />
              <div data-h2-background="base(secondary)" />
              <div data-h2-background="base(secondary.dark)" />
              <div data-h2-background="base(secondary.darker)" />
              <div data-h2-background="base(secondary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(tertiary.lightest)" />
              <div data-h2-background="base(tertiary.lighter)" />
              <div data-h2-background="base(tertiary.light)" />
              <div data-h2-background="base(tertiary)" />
              <div data-h2-background="base(tertiary.dark)" />
              <div data-h2-background="base(tertiary.darker)" />
              <div data-h2-background="base(tertiary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(quaternary.lightest)" />
              <div data-h2-background="base(quaternary.lighter)" />
              <div data-h2-background="base(quaternary.light)" />
              <div data-h2-background="base(quaternary)" />
              <div data-h2-background="base(quaternary.dark)" />
              <div data-h2-background="base(quaternary.darker)" />
              <div data-h2-background="base(quaternary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(quinary.lightest)" />
              <div data-h2-background="base(quinary.lighter)" />
              <div data-h2-background="base(quinary.light)" />
              <div data-h2-background="base(quinary)" />
              <div data-h2-background="base(quinary.dark)" />
              <div data-h2-background="base(quinary.darker)" />
              <div data-h2-background="base(quinary.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(foreground.lightest)" />
              <div data-h2-background="base(foreground.lighter)" />
              <div data-h2-background="base(foreground.light)" />
              <div data-h2-background="base(foreground)" />
              <div data-h2-background="base(foreground.dark)" />
              <div data-h2-background="base(foreground.darker)" />
              <div data-h2-background="base(foreground.darkest)" />
            </div>
            <div>
              <div data-h2-background="base(background.lightest)" />
              <div data-h2-background="base(background.lighter)" />
              <div data-h2-background="base(background.light)" />
              <div data-h2-background="base(background)" />
              <div data-h2-background="base(background.dark)" />
              <div data-h2-background="base(background.darker)" />
              <div data-h2-background="base(background.darkest)" />
            </div>
          </div>
        </div>
        <div
          data-h2-background="base:children[>div](background)"
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr 1fr)"
          className="my-6"
          data-h2-padding="base:children[>div](x1)"
        >
          <div data-h2="light">
            <div
              data-h2-background="base(background.dark)"
              data-h2-padding="base(x1)"
              data-h2-border="base(1px solid background.darkest)"
              data-h2-color="base(background.darkest)"
              data-h2-radius="base(5px)"
            >
              <p className="font-bold">This is a sample well title.</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Accusamus laudantium, ipsum esse voluptas voluptate sequi facere
                vitae quo quia. Deleniti, itaque? Reiciendis recusandae repellat
                animi voluptatem explicabo aliquam neque asperiores.
              </p>
            </div>
          </div>
          <div data-h2="dark">
            <div
              data-h2-background="base(background.dark)"
              data-h2-padding="base(x1)"
              data-h2-border="base(1px solid background.darkest)"
              data-h2-color="base(background.darkest)"
              data-h2-radius="base(5px)"
            >
              <p className="font-bold">This is a sample well title.</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Accusamus laudantium, ipsum esse voluptas voluptate sequi facere
                vitae quo quia. Deleniti, itaque? Reiciendis recusandae repellat
                animi voluptatem explicabo aliquam neque asperiores.
              </p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Styleguide;
